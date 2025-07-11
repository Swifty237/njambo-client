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
import { Player, Table } from '../../types/SeatTypesProps';

declare global {
    interface Window {
        socket?: Socket;
    }
}

interface LobbyInfo {
    tables: Table[];
    players: Player[];
    socketId: string;
}

const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isLoggedIn } = useContext(authContext);
    const { setTables, setPlayers, id: userId } = useContext(globalContext);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketId, setSocketId] = useState<string | null>(null);

    const filterActiveTables = (tables: Table[]) => {
        return tables.filter(table => {
            const seats = table.seats || {};
            return Object.values(seats).some(seat => seat && seat.player);
        });
    };

    const checkStoredTableExists = (tables: Table[]) => {
        const storedLink = localStorage.getItem('storedLink');
        if (storedLink) {
            try {
                const decodedData = JSON.parse(atob(storedLink));
                const tableStillExists = tables.some(table => table.id === decodedData.id);

                if (!tableStillExists) {
                    localStorage.removeItem('storedLink');
                    localStorage.removeItem('seatId');
                    localStorage.removeItem('isPlayerSeated');
                }
            } catch (error) {
                localStorage.removeItem('storedLink');
            }
        }
    };

    useEffect(() => {
        window.addEventListener('beforeclose', cleanUp);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (isLoggedIn && userId) {
            const token = localStorage.token;
            const webSocket = socket || connect();

            token && webSocket && webSocket.emit(FETCH_LOBBY_INFO, token);
        } else {
            const token = localStorage.getItem('token');
            if (!token) {
                cleanUp();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, userId]);

    function cleanUp() {
        if (window.socket) {
            window.socket.emit(DISCONNECT);
            window.socket.close();
            window.socket = undefined;
        }
        setSocket(null);
        setSocketId(null);
        setPlayers([]);
        setTables([]);
    }

    function connect() {
        const socket = io(config.socketURI, {
            transports: ['websocket'],
            upgrade: false,
            auth: {
                userId: localStorage.getItem('userId'),
                userName: localStorage.getItem('userName'),
                chipsAmount: Number(localStorage.getItem('chipsAmount')),
                token: localStorage.getItem('token')
            }
        });

        registerCallbacks(socket);
        setSocket(socket);
        window.socket = socket;
        return socket;
    }

    function registerCallbacks(socket: Socket) {
        socket.on(RECEIVE_LOBBY_INFO, ({ tables, players, socketId }: LobbyInfo) => {
            checkStoredTableExists(tables);
            const activeTables = filterActiveTables(tables);
            setSocketId(socketId);
            setTables(activeTables);
            setPlayers(players);
        });

        socket.on(PLAYERS_UPDATED, (players: Player[]) => {
            setPlayers(players);
        });

        socket.on(TABLES_UPDATED, (tables: Table[]) => {
            checkStoredTableExists(tables);
            const activeTables = filterActiveTables(tables);
            setTables(activeTables);
        });
    }

    return (
        <SocketContext.Provider value={{ socket, socketId, setSocket, cleanUp }}>
            {children}
        </SocketContext.Provider>
    );
};

export default WebSocketProvider;
