import React, { useState, useEffect, useContext } from 'react';
import authContext from '../auth/authContext';
import SocketContext from './socketContext';
import io from 'socket.io-client';
import {
  DISCONNECT,
  FETCH_LOBBY_INFO,
  PLAYERS_UPDATED,
  RECEIVE_LOBBY_INFO,
  TABLES_UPDATED,
} from '../../pokergame/actions';
import globalContext from '../global/globalContext';
import config from '../../clientConfig';

// Extend the Window interface to include the socket property
declare global {
  interface Window {
    socket?: Socket;
  }
}

interface LobbyInfo {
  tables: string;
  players: string;
  socketId: string;
}

const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useContext(authContext);
  const { setTables, setPlayers } = useContext(globalContext);

  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    window.addEventListener('beforeunload', cleanUp);
    window.addEventListener('beforeclose', cleanUp);
    return () => cleanUp();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const token = localStorage.token;
      const webSocket = socket || connect();

      token && webSocket && webSocket.emit(FETCH_LOBBY_INFO, token);
    } else {
      cleanUp();
    }
    return () => cleanUp();
    // eslint-disable-next-line
  }, [isLoggedIn]);

  function cleanUp() {
    window.socket && window.socket.emit(DISCONNECT);
    window.socket && window.socket.close();
    setSocket(null);
    setSocketId(null);
    setPlayers('');
    setTables('');
  }

  function connect() {
    const socket = io(config.socketURI, {
      transports: ['websocket'],
      upgrade: false,
    });
    registerCallbacks(socket);
    setSocket(socket);
    window.socket = socket;
    return socket;
  }

  function registerCallbacks(socket: Socket) {
    socket.on(RECEIVE_LOBBY_INFO, ({ tables, players, socketId }: LobbyInfo) => {
      setSocketId(socketId);
      setTables(tables);
      setPlayers(players);
    });

    socket.on(PLAYERS_UPDATED, (players: string) => {
      console.log(PLAYERS_UPDATED, players);
      setPlayers(players);
    });

    socket.on(TABLES_UPDATED, (tables: string) => {
      console.log(TABLES_UPDATED, tables);
      setTables(tables);
    });
  }

  return (
    <SocketContext.Provider value={{ socket, socketId, cleanUp }}>
      {children}
    </SocketContext.Provider>
  );
};

export default WebSocketProvider;
