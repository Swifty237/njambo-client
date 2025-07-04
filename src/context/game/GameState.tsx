// Copier le contenu de GameState_withUserId.tsx
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
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
} from '../../pokergame/actions';
import authContext from '../auth/authContext';
import socketContext from '../websocket/socketContext';
import globalContext from '../global/globalContext';
import GameContext from './gameContext';
import { Table, TableUpdatedPayload, TableEventPayload, CardProps, JoinTableProps, Seat } from '../../types/SeatTypesProps';
import io from 'socket.io-client';
import config from '../../clientConfig';

interface GameStateProps {
    children: React.ReactNode
}

const GameState = ({ children }: GameStateProps) => {
    const SERVER_URI = process.env.REACT_APP_SERVER_URI;
    const history = useHistory();
    const { socket, setSocket } = useContext(socketContext);
    const { loadUser } = useContext(authContext);
    const { id: userId, userName } = useContext(globalContext);

    interface FoundSeat {
        seatId: string;
        seat: Seat | null;
    }

    const [tablesList, setTablesList] = useState<Table[]>([])
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
        if (!socket || !userId) return;

        const cleanup = () => {
            window.removeEventListener('beforeunload', leaveTable);
        };

        // Ajouter l'event listener pour la fermeture de fenêtre
        window.addEventListener('beforeunload', leaveTable);

        // Configuration des event listeners socket
        const handleTableUpdated = ({ table, message }: TableUpdatedPayload) => {
            console.log('🔄 [GameState] TABLE_UPDATED reçu - tableId:', table.id);
            setCurrentTable(table);
            message && addMessage(message);
        };

        const handleTableJoined = ({ tables, tableId }: TableEventPayload) => {
            console.log('🎯 [GameState] TABLE_JOINED reçu:', tableId);
            setCurrentTables(tables);
            setCurrentTable(tables[tableId]);
        };

        const handleTableLeft = () => {
            setCurrentTable(null);
            loadUser(localStorage.token);
            setMessages([]);
        };

        const handlePlayedCard = ({ tables, tableId }: TableEventPayload) => {
            setCurrentTables(tables);
            setCurrentTable(tables[tableId]);
        };

        const handleShowDown = ({ tables, tableId }: TableEventPayload) => {
            setCurrentTables(tables);
            setCurrentTable(tables[tableId]);
        };

        const handleChatMessage = ({ tables, tableId }: TableEventPayload) => {
            let targetTable;
            if (Array.isArray(tables)) {
                targetTable = tables.find((table: any) => table.id === tableId);
                const tablesObj = tables.reduce((acc: any, table: any) => {
                    acc[table.id] = table;
                    return acc;
                }, {});
                setCurrentTables(tablesObj);
            } else {
                targetTable = tables[tableId];
                setCurrentTables(tables);
            }

            if (targetTable) {
                setCurrentTable(targetTable);
            }
        };

        const handleConnect = () => {
            console.log('🔌 [GameState] Socket connectée avec userId:', userId);
        };

        // Enregistrer les event listeners
        socket.on(TABLE_UPDATED, handleTableUpdated);
        socket.on(TABLE_JOINED, handleTableJoined);
        socket.on(TABLE_LEFT, handleTableLeft);
        socket.on(PLAYED_CARD, handlePlayedCard);
        socket.on(SHOW_DOWN, handleShowDown);
        socket.on(CHAT_MESSAGE_RECEIVED, handleChatMessage);
        socket.on('connect', handleConnect);

        // Cleanup function
        return () => {
            cleanup();
            socket.off(TABLE_UPDATED, handleTableUpdated);
            socket.off(TABLE_JOINED, handleTableJoined);
            socket.off(TABLE_LEFT, handleTableLeft);
            socket.off(PLAYED_CARD, handlePlayedCard);
            socket.off(SHOW_DOWN, handleShowDown);
            socket.off(CHAT_MESSAGE_RECEIVED, handleChatMessage);
            socket.off('connect', handleConnect);
        };
    }, [socket, userId, loadUser]);

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
                return {};
        }
    }

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

    const joinTableByLink = async (link: string): Promise<boolean> => {
        console.log('🔗 [GameState] Validation du lien de table:', link);

        try {
            // Valider le format du lien
            const decodedData = JSON.parse(atob(link));

            if (!decodedData.id || !decodedData.name) {
                console.error('❌ [GameState] Lien invalide - données manquantes');
                return false;
            }

            // Sauvegarder le lien pour la reconnexion
            localStorage.setItem('storedLink', link);
            console.log('✅ [GameState] Lien validé et sauvé');
            return true;
        } catch (error) {
            console.error('❌ [GameState] Erreur lors de la validation du lien:', error);
            return false;
        }
    };

    const joinTable = (table: JoinTableProps) => {
        if (!socket) {
            return;
        }

        if (!socket.id) {
            return;
        }

        // Sauvegarder l'ID utilisateur au lieu du socketId
        if (userId) {
            localStorage.setItem('userId', userId);
        }
        if (userName) {
            localStorage.setItem('userName', userName);
        }

        socket.emit(JOIN_TABLE, table);
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
        console.log('🪑 [GameState] sitDown appelé:', {
            tableId,
            seatId,
            amount,
            socketConnected: !!socket,
            socketId: socket?.id,
            userId: userId
        });

        socket.emit(SIT_DOWN, { tableId, seatId, amount });

        console.log('📤 [GameState] SIT_DOWN émis vers le serveur');

        setIsPlayerSeated(true);
        setSeatId(seatId);

        localStorage.setItem("isPlayerSeated", "true");
        localStorage.setItem("seatId", seatId);

        console.log('💾 [GameState] États locaux mis à jour:', {
            isPlayerSeated: true,
            seatId,
            localStorageUpdated: true
        });
    };

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
                tablesList,
                refresh,
                setRefresh,
                setTablesList,
                joinTable,
                joinTableByLink,
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
