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

interface GameStateProps {
  history: History;
  children: React.ReactNode
}

interface CardProps {
  suit: string,
  rank: string
}

interface Player {
  name: string;
}

interface SeatData {
  id: string;
  turn: boolean;
  stack: number;
  sittingOut: boolean;
  player: Player;
  bet: number;
  hand: CardProps[];
  lastAction?: string;
}

interface Table {
  id: string;
  name: string;
  seats: { [seatId: string]: SeatData };
  limit: number;
  minBet: number;
  callAmount: number;
  pot: number;
  minRaise: number;
  board: CardProps[];
  winMessages: string;
  button: string;
  handOver: boolean;
}

interface TableUpdatedPayload {
  table: Table;
  message: string;
  from: string;
}

interface TableEventPayload {
  tables: Record<string, Table>;
  tableId: string;
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
        injectDebugHand
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameState;
