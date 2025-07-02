import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
  PLAY_ONE_CARD,
  PLAYED_CARD,
  SHOW_DOWN,
  SEND_CHAT_MESSAGE,
  CHAT_MESSAGE_RECEIVED,
  PLAYER_RECONNECTED,
  RECONNECT_PLAYER
} from '../../pokergame/actions';
import authContext from '../auth/authContext';
import socketContext from '../websocket/socketContext';
import GameContext, { TatamiProps } from './gameContext';
import { Table, TableUpdatedPayload, TableEventPayload, CardProps } from '../../types/SeatTypesProps';
import io from 'socket.io-client';
import config from '../../clientConfig';

interface GameStateProps {
  children: React.ReactNode
}

const GameState = ({ children }: GameStateProps) => {
  const history = useHistory();
  const { socket, setSocket } = useContext(socketContext);
  const { loadUser } = useContext(authContext);
  const [tatamiDataList, setTatamiDataList] = useState<TatamiProps[]>([])
  const [messages, setMessages] = useState<string[]>([]);
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [currentTables, setCurrentTables] = useState<{ [key: string]: Table } | null>(null);
  const [isPlayerSeated, setIsPlayerSeated] = useState(false);
  const [seatId, setSeatId] = useState<string | null>(null);
  const [elevatedCard, setElevatedCard] = useState<string | null>(null);
  const [bet, setBet] = useState<string>('25');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const currentTableRef = React.useRef(currentTable);
  const currentTablesRef = React.useRef(currentTables);
  const [refresh, setRefresh] = useState(false);


  useEffect(() => {
    currentTableRef.current = currentTable;
    currentTablesRef.current = currentTables;

    // eslint-disable-next-line
  }, [currentTable]);

  useEffect(() => {
    // Si la socket n'existe pas, on vérifie le localStorage
    if (!socket) {
      const storedSocketId = localStorage.getItem('socketId');
      if (storedSocketId) {
        // Créer une nouvelle socket avec le socketId stocké
        const newSocket = io(config.socketURI, {
          transports: ['websocket'],
          upgrade: false,
          auth: { socketId: storedSocketId }
        });
        setSocket(newSocket);
      }
    }

    const storedLink = localStorage.getItem('storedLink');

    if (socket) {
      // window.addEventListener('unload', leaveTable);
      window.addEventListener('close', leaveTable);

      socket.on(TABLE_UPDATED, ({ table, message }: TableUpdatedPayload) => {
        setCurrentTable(table);
        message && addMessage(message);
      });

      socket.on(TABLE_JOINED, ({ tables, tableId }: TableEventPayload) => {
        setCurrentTables(tables);
        setCurrentTable(tables[tableId]);
      });

      socket.on(TABLE_LEFT, ({ tables }: TableEventPayload) => {
        setCurrentTable(null);
        loadUser(localStorage.token);
        setMessages([]);
      });

      socket.on(PLAYED_CARD, ({ tables, tableId }: TableEventPayload) => {
        setCurrentTables(tables);
        setCurrentTable(tables[tableId]);
      });

      socket.on(SHOW_DOWN, ({ tables, tableId }: TableEventPayload) => {
        setCurrentTables(tables);
        setCurrentTable(tables[tableId]);
      });

      socket.on(CHAT_MESSAGE_RECEIVED, ({ tables, tableId }: TableEventPayload) => {
        // Si tables est un tableau, chercher la table par ID
        let targetTable;
        if (Array.isArray(tables)) {
          targetTable = tables.find((table: any) => table.id === tableId);
        } else {
          targetTable = tables[tableId];
        }

        if (Array.isArray(tables)) {
          // Convertir le tableau en objet pour setCurrentTables
          const tablesObj = tables.reduce((acc: any, table: any) => {
            acc[table.id] = table;
            return acc;
          }, {});
          setCurrentTables(tablesObj);
        } else {
          setCurrentTables(tables);
        }

        if (targetTable) {
          setCurrentTable(targetTable);
        }
      });

      // Écouter la réponse de reconnexion du serveur
      socket.on(PLAYER_RECONNECTED, ({ table, seatId }: { table: Table, seatId: string }) => {
        setCurrentTable(table);

        // Faire le sitDown avec les données récupérées du serveur
        const currentSeat = table.seats[seatId];
        if (currentSeat) {
          sitDown(table.id, seatId, currentSeat.stack);
        }
      });

      // Attendre que la socket soit connectée avant d'essayer de rejoindre une table
      socket.on('connect', () => {
        if (storedLink && localStorage.token) {
          try {
            const decodedData = JSON.parse(atob(storedLink));
            const tatamiData: TatamiProps = {
              id: decodedData.id,
              name: decodedData.name,
              bet: decodedData.bet,
              isPrivate: decodedData.isPrivate,
              createdAt: new Date().toLocaleString(),
              link: storedLink
            };
            history.push(`/play/${storedLink}`);
            // loadUser(localStorage.token);
            joinTable(tatamiData);

            const storedSeatId = localStorage.getItem("seatId");
            const storedPlayerSeated = localStorage.getItem("isPlayerSeated");

            if (storedPlayerSeated) {
              if (storedSeatId) {
                const currentSeat = currentTable?.seats[storedSeatId];
                currentSeat && sitDown(tatamiData.id, storedSeatId, currentSeat.stack)
              }
            }

          } catch (error) {
            console.error('Invalid stored table link:', error);
            history.push('/');
          }
        }
      });
    }

    // return () => leaveTable();
    // eslint-disable-next-line
  }, [socket]);


  // Fonction de test
  const injectDebugHand = (seatNumber: string) => {
    if (!currentTable) return;

    // Copie profonde pour éviter mutation
    const updatedSeats = {
      ...currentTable.seats,
      [seatNumber]: {
        ...currentTable.seats[seatNumber],
        hand: [
          { suit: 'h', rank: '8' },
          { suit: 's', rank: '10' },
          { suit: 'c', rank: '10' },
          { suit: 'd', rank: '5' },
          { suit: 's', rank: '3' },
        ],
        playedHand: [
          { suit: 'h', rank: '8' },
          { suit: 's', rank: '10' },
          { suit: 'c', rank: '10' },
          { suit: 'd', rank: '5' },
          { suit: 's', rank: '3' },
        ],
      },
    };

    const updatedTable: Table = {
      ...currentTable,
      seats: updatedSeats,
    };

    setCurrentTable(updatedTable);
  };

  // Fonction pour abaisser toutes les cartes
  // const clearAllElevatedCards = () => {
  //   setElevatedCards([]);
  // };

  const getHandsPosition = (seatId: string) => {
    switch (seatId) {
      case "1":
        return {
          bottom: "-5vh",
          left: "2vw"
        };
      case "2":
        return {
          left: "2vw"
        };
      case "3":
        return {
          display: "flex",
          flexDirection: "column-reverse",
          top: "-5vh",
          right: "2vw"
        };
      case "4":
        return {
          display: "flex",
          flexDirection: "column-reverse",
          right: "2vw"
        };
      default:
        return {

        };
    }
  }




  const joinTable = (tatamiData: TatamiProps) => {
    if (!socket) {
      return;
    }

    if (!socket.id) {
      return;
    }

    // Tester si il y a un socketId enregistré dans le localStorage
    const storedSocketId = localStorage.getItem('socketId');

    // Si oui, est-ce que c'est le même socketId que celui de la socket actuelle ?
    if (storedSocketId && storedSocketId !== undefined) {
      // Si les socketIds ne sont pas identiques, on remplace l'ancien par le nouveau
      if (storedSocketId !== socket.id) {
        localStorage.setItem('socketId', socket.id);
      }
      // Si c'est le même socketId, on ne fait rien
    } else {
      // Si pas de socketId stocké, on l'enregistre
      localStorage.setItem('socketId', socket.id);
    }

    socket.emit(JOIN_TABLE, tatamiData);
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

    localStorage.setItem("isPlayerSeated", "true");
    localStorage.setItem("seatId", seatId);
  };

  // Fonction pour jouer une carte (double clic) - modifiée
  const playOneCard = (card: CardProps, seatNumber: string) => {

    if (currentTable) {
      const currentSeat = currentTable.seats[seatNumber];

      if (currentSeat && currentSeat.hand) {

        // Trouver la carte dans la main
        const cardIndex = currentSeat.hand.findIndex((handCard) => handCard.suit === card.suit && handCard.rank === card.rank);

        if (cardIndex === -1) {
          return;
        }

        // Envoyer la carte au serveur via socket
        if (socket && currentTable) {
          socket.emit(PLAY_ONE_CARD, {
            tableId: currentTable.id,
            seatId: seatNumber,
            playedCard: card,
          });
        }
      }
    }

    // Retirer la carte jouée des cartes élevées
    const cardKey = `${seatNumber}-${card.suit}-${card.rank}`;
    if (elevatedCard === cardKey) {
      setElevatedCard(null);
    }
  };

  const sendMessage = (message: string, seatId: string | null) => {
    if (currentTable && message !== "") {
      socket.emit(SEND_CHAT_MESSAGE, {
        tableId: currentTable.id,
        seatId: seatId || null, // Envoyer null pour les observateurs
        message,
      });
    }
  }

  const showDown = () => {
    if (currentTableRef && currentTableRef.current && seatId) {
      socket.emit(SHOW_DOWN, {
        tableId: currentTableRef.current.id,
        seatId: seatId
      });
    }
  }

  const rebuy = (tableId: string, seatId: string, amount: number) => {
    socket.emit(REBUY, { tableId, seatId, amount });
  };

  const standUp = () => {
    currentTableRef &&
      currentTableRef.current &&
      socket.emit(STAND_UP, currentTableRef.current.id);
    setIsPlayerSeated(false);
    setSeatId(null);
    localStorage.removeItem("seatId");
    localStorage.removeItem("isPlayerSeated");
  };

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
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
        tatamiDataList,
        refresh,
        setRefresh,
        setTatamiDataList,
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
        getHandsPosition,
        playOneCard,
        setElevatedCard,
        showDown,
        sendMessage
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameState;
