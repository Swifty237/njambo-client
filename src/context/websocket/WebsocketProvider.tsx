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

// Extend the Window interface to include the socket property
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
    const { setTables, setPlayers, id: userId, userName, chipsAmount } = useContext(globalContext);

    const [socket, setSocket] = useState<Socket | null>(null);
    const [socketId, setSocketId] = useState<string | null>(null);

    useEffect(() => {
        window.addEventListener('beforeunload', cleanUp);
        window.addEventListener('beforeclose', cleanUp);
        return () => cleanUp();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (isLoggedIn && userId) {
            const token = localStorage.token;
            const webSocket = socket || connect();

            token && webSocket && webSocket.emit(FETCH_LOBBY_INFO, token);
        } else {
            // Ne pas nettoyer immédiatement lors du rechargement
            // Vérifier s'il y a un token dans localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                cleanUp();
            }
        }
        // eslint-disable-next-line
    }, [isLoggedIn, userId]);

    function cleanUp() {
        console.log('🧹 [WebSocket] Nettoyage de la socket...');
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
        console.log('🔌 [WebSocket] Connexion à la socket avec userId:', userId, 'userName:', userName);

        // Créer la socket avec l'ID utilisateur dans l'auth
        const socket = io(config.socketURI, {
            transports: ['websocket'],
            upgrade: false,
            auth: {
                userId,
                userName,
                chipsAmount,
                token: localStorage.getItem('token')
            }
        });

        socket.on('connect', () => {
            console.log('✅ [WebSocket] Socket connectée avec ID:', socket.id, 'pour utilisateur:', userId);

            // Sauvegarder l'ID utilisateur et le nom dans localStorage pour la restauration
            if (userId) localStorage.setItem('userId', userId);
            if (userName) localStorage.setItem('userName', userName);
        });

        socket.on('disconnect', () => {
            console.log('❌ [WebSocket] Socket déconnectée pour utilisateur:', userId);
        });

        registerCallbacks(socket);
        setSocket(socket);
        window.socket = socket;
        return socket;
    }

    function registerCallbacks(socket: Socket) {
        console.log('📝 [WebSocket] Enregistrement des callbacks...');

        socket.on(RECEIVE_LOBBY_INFO, ({ tables, players, socketId }: LobbyInfo) => {
            console.log('📨 [WebSocket] RECEIVE_LOBBY_INFO reçu:', { socketId, tablesCount: tables.length, playersCount: players.length });
            setSocketId(socketId);
            setTables(tables);
            setPlayers(players);
        });

        socket.on(PLAYERS_UPDATED, (players: Player[]) => {
            console.log('👥 [WebSocket] PLAYERS_UPDATED reçu:', { playersCount: players.length });
            setPlayers(players);
        });

        socket.on(TABLES_UPDATED, (tables: Table[]) => {
            console.log('🎲 [WebSocket] TABLES_UPDATED reçu:', { tablesCount: tables.length });
            setTables(tables);
        });

        socket.on('error', (error: Error) => {
            console.error('❌ [WebSocket] Erreur socket:', error);
        });

        socket.on('connect_error', (error: Error) => {
            console.error('❌ [WebSocket] Erreur de connexion:', error);
        });
    }

    return (
        <SocketContext.Provider value={{ socket, socketId, setSocket, cleanUp }}>
            {children}
        </SocketContext.Provider>
    );
};

export default WebSocketProvider;
