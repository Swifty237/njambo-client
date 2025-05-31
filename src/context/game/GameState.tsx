import React, { useContext, useEffect, useState } from 'react';
// import { withRouter } from 'react-router-dom';
import {
  CALL,
  CHECK,
  FOLD,
  JOIN_TABLE,
  LEAVE_TABLE,
  RAISE,
  REBUY,
  SIT_DOWN,
  STAND_UP,
  TABLE_JOINED,
  TABLE_LEFT,
  TABLE_UPDATED,
} from '../../pokergame/actions';
import authContext from '../auth/authContext';
import socketContext from '../websocket/socketContext';
import GameContext from './gameContext';
import { History } from 'history';
import { Table, TableUpdatedPayload, TableEventPayload, CardProps, SeatData } from '../../types/SeatTypesProps';

interface GameStateProps {
  history: History;
  children: React.ReactNode
}

const GameState = ({ history, children }: GameStateProps) => {
  const { socket } = useContext(socketContext);
  const { loadUser } = useContext(authContext);

  const [messages, setMessages] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [isPlayerSeated, setIsPlayerSeated] = useState(false);
  const [seatId, setSeatId] = useState<string | null>(null);
  const [turn, setTurn] = useState(false);
  const [turnTimeOutHandle, setTurnTimeOutHandle] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [elevatedCard, setElevatedCard] = useState<string | null>(null);

  const currentTableRef = React.useRef(currentTable);

  useEffect(() => {
    currentTableRef.current = currentTable;

    isPlayerSeated &&
      seatId &&
      currentTable?.seats[seatId] &&
      turn !== currentTable.seats[seatId].turn &&
      setTurn(currentTable.seats[seatId].turn);
    // eslint-disable-next-line
  }, [currentTable]);

  useEffect(() => {
    if (turn && !turnTimeOutHandle) {
      const handle = setTimeout(fold, 15000);
      setTurnTimeOutHandle(handle);
    } else {
      turnTimeOutHandle && clearTimeout(turnTimeOutHandle);
      turnTimeOutHandle && setTurnTimeOutHandle(null);
    }
    // eslint-disable-next-line
  }, [turn]);

  useEffect(() => {
    if (socket) {
      window.addEventListener('unload', leaveTable);
      window.addEventListener('close', leaveTable);

      socket.on(TABLE_UPDATED, ({ table, message, from }: TableUpdatedPayload) => {
        console.log(TABLE_UPDATED, table, message, from);
        setCurrentTable(table);
        message && addMessage(message);
      });

      socket.on(TABLE_JOINED, ({ tables, tableId }: TableEventPayload) => {
        console.log(TABLE_JOINED, tables, tableId);
        setCurrentTable(tables[tableId]);
      });

      socket.on(TABLE_LEFT, ({ tables, tableId }: TableEventPayload) => {
        console.log(TABLE_LEFT, tables, tableId);
        setCurrentTable(null);
        loadUser(localStorage.token);
        setMessages([]);
      });
    }
    return () => leaveTable();
    // eslint-disable-next-line
  }, [socket]);


  // Fonction de test
  const injectDebugHand = (seatNumber: string) => {
    setCurrentTable((prevTable) => {
      if (!prevTable) return null;

      // Copie profonde pour éviter mutation
      const updatedSeats = {
        ...prevTable.seats,
        [seatNumber]: {
          ...prevTable.seats[seatNumber],
          hand: [
            { suit: 'h', rank: '8' },
            { suit: 's', rank: '10' },
            { suit: 'c', rank: '10' },
            { suit: 'd', rank: '5' },
            { suit: 's', rank: '3' },
          ],
        },
      };

      const updatedTable: Table = {
        ...prevTable,
        seats: updatedSeats,
      };

      return updatedTable;
    });
  };

  // Fonction pour jouer une carte (double clic)
  const playCard = (card: CardProps, seatNumber: string) => {

    console.log('=== PLAYCARD FUNCTION START ===');
    console.log('Received card:', card);
    console.log('Received seatNumber:', seatNumber);
    console.log('Current table exists:', !!currentTable);

    setCurrentTable((prevTable) => {

      console.log('Inside setCurrentTable callback');
      console.log('prevTable exists:', !!prevTable);

      if (!prevTable) {
        console.log('No prevTable, returning null');
        return null;
      }

      const currentSeat = prevTable.seats[seatNumber];

      console.log('Current seat:', currentSeat);
      console.log('Current seat hand:', currentSeat?.hand);

      if (!currentSeat || !currentSeat.hand) return prevTable;
      console.log('No current seat or hand, returning prevTable');

      // Trouver la carte dans la main
      const cardIndex = currentSeat.hand.findIndex(
        (handCard) => handCard.suit === card.suit && handCard.rank === card.rank
      );

      if (cardIndex === -1) {
        // Carte non trouvée dans la main
        console.warn('Carte non trouvée dans la main du joueur');
        return prevTable;
      }

      // Retirer la carte de la main
      const updatedHand = currentSeat.hand.filter((_, index) => index !== cardIndex);

      // Ajouter la carte aux cartes jouées
      const updatedPlayedCards = [...(currentSeat.playedCards || []), card];

      // Mettre à jour le siège
      const updatedSeats = {
        ...prevTable.seats,
        [seatNumber]: {
          ...currentSeat,
          hand: updatedHand,
          playedCards: updatedPlayedCards,
        },
      };

      const updatedTable = {
        ...prevTable,
        seats: updatedSeats,
      };

      return updatedTable;
    });
  };

  const getAvatarPosition = (id: string | null) => {
    switch (id) {
      case '1':
        return {
          top: "3vh",
          left: "8vw"
        };
      case '2':
        return {
          top: "20vh",
        };
      case '3':
        return {
          top: "2vh",
          right: "6vw"
        };
      case '4':
        return {
          bottom: "20vh",
        };
      default:
        return {};
    }
  }

  const getHandPosition = (id: string | null) => {

    if (id === "1" || id === "3") {
      return {
        top: "5.5vh",
      }
    } else {
      return {
        left: "4.7vh",
      }
    }
  }

  const getPlayedCardsPosition = (id: string | null, seat: SeatData) => {
    switch (id) {
      case '1':
        if (seat.hand.length === 1) {
          return {
            top: "-7vh",
            left: "8vw"
          };
        } else if (seat.hand.length === 2) {
          return {
            top: "-7vh",
            left: "7vw"
          };
        } else if (seat.hand.length === 3) {
          return {
            top: "-7vh",
            left: "6vw"
          };
        } else if (seat.hand.length === 4) {
          return {
            top: "-7vh",
            left: "5vw"
          };
        } else if (seat.hand.length === 5) {
          return {
            top: "-7vh",
            left: "4vw"
          };
        } else {
          return
        }

      case '2':
        return {
          top: "6vh",
        };
      case '3':

        if (seat.hand.length === 1) {
          return {
            top: "-7vh",
            right: "8vw"
          };
        } else if (seat.hand.length === 2) {
          return {
            top: "-7vh",
            right: "7vw"
          };
        } else if (seat.hand.length === 3) {
          return {
            top: "-7vh",
            right: "6vw"
          };
        } else if (seat.hand.length === 4) {
          return {
            top: "-7vh",
            right: "5vw"
          };
        } else if (seat.hand.length === 5) {
          return {
            top: "-7vh",
            right: "4vw"
          };
        } else {
          return
        }

      case '4':
        return {
          bottom: "6vh",
        };
      default:
        return {};
    }
  }


  const joinTable = (tableId: string) => {
    console.log(JOIN_TABLE, tableId);
    socket.emit(JOIN_TABLE, tableId);
  };

  const leaveTable = () => {
    isPlayerSeated && standUp();
    currentTableRef &&
      currentTableRef.current &&
      currentTableRef.current.id &&
      socket.emit(LEAVE_TABLE, currentTableRef.current.id);
    history.push('/');
  };

  const sitDown = (tableId: string, seatId: string, amount: number) => {
    socket.emit(SIT_DOWN, { tableId, seatId, amount });
    setIsPlayerSeated(true);
    setSeatId(seatId);
  };

  const rebuy = (tableId: string, seatId: string, amount: number) => {
    socket.emit(REBUY, { tableId, seatId, amount });
  };

  const standUp = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(STAND_UP, currentTableRef.current.id);
    setIsPlayerSeated(false);
    setSeatId(null);
  };

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    console.log(message);
  };

  const fold = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(FOLD, currentTableRef.current.id);
  };

  const check = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(CHECK, currentTableRef.current.id);
  };

  const call = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(CALL, currentTableRef.current.id);
  };

  const raise = (amount: number) => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(RAISE, { tableId: currentTableRef.current.id, amount });
  };

  return (
    <GameContext.Provider
      value={{
        messages,
        currentTable,
        isPlayerSeated,
        seatId,
        elevatedCard,
        joinTable,
        leaveTable,
        sitDown,
        standUp,
        addMessage,
        fold,
        check,
        call,
        raise,
        rebuy,
        injectDebugHand,
        getAvatarPosition,
        getHandPosition,
        getPlayedCardsPosition,
        playCard,
        setElevatedCard
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameState;
