import React, { useContext, useEffect, useState, useRef } from 'react';
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
    REFRESH_CHAT,
} from '../../pokergame/actions';

import authContext from '../auth/authContext';
import socketContext from '../websocket/socketContext';
import globalContext from '../global/globalContext';
import GameContext from './gameContext';

import {
    Table,
    TableUpdatedPayload,
    TableEventPayload,
    CardProps,
    JoinTableProps,
} from '../../types/SeatTypesProps';
import tableContext from '../table/tableContext';

interface GameStateProps {
    children: React.ReactNode;
}

const GameState = ({ children }: GameStateProps) => {
    const history = useHistory();
    const { socket, cleanUp } = useContext(socketContext);
    const { loadUser } = useContext(authContext);
    const { id: userId, setTurnStartTime } = useContext(globalContext);
    const { setIsOnTables } = useContext(tableContext);

    // Table listings
    const [tablesList, setTablesList] = useState<Table[]>([]);

    // The "current table" in focus
    const [currentTable, setCurrentTable] = useState<Table | null>(null);
    const [currentTables, setCurrentTables] = useState<{ [key: string]: Table } | null>(null);

    // Player seat state
    const [isPlayerSeated, setIsPlayerSeated] = useState(false);
    const [seatId, setSeatId] = useState<string | null>(null);

    // Additional game state
    const [messages, setMessages] = useState<string[]>([]);
    const [refresh, setRefresh] = useState(false);
    const [elevatedCard, setElevatedCard] = useState<string | null>(null);

    // Refs to track the current table state outside of React's re-render cycle
    const currentTableRef = useRef<Table | null>(null);
    const currentTablesRef = useRef<{ [key: string]: Table } | null>(null);

    // Sync local refs whenever these states change
    useEffect(() => {
        currentTableRef.current = currentTable;
        currentTablesRef.current = currentTables;
    }, [currentTable, currentTables]);

    // Utility to add messages
    const addMessage = (message: string) => {
        setMessages((prev) => [...prev, message]);
    };

    // Called when the user leaves the table
    const leaveTable = () => {

        if (currentTableRef.current?.id && socket) {
            socket.emit(LEAVE_TABLE, currentTableRef.current.id);
        }

        cleanUp();

        // Retirer la table spécifique du tableau isOnTables
        if (currentTableRef.current?.id) {
            setIsOnTables(prev => prev.filter(table => table.tableId !== currentTableRef.current!.id));

            // Mettre à jour le localStorage
            const storedTables = localStorage.getItem('isOnTables');
            if (storedTables) {
                try {
                    const parsedTables = JSON.parse(storedTables);
                    const updatedTables = parsedTables.filter((table: any) => table.tableId !== currentTableRef.current!.id);
                    if (updatedTables.length > 0) {
                        localStorage.setItem('isOnTables', JSON.stringify(updatedTables));
                    } else {
                        localStorage.removeItem('isOnTables');
                    }
                } catch (error) {
                    localStorage.removeItem('isOnTables');
                }
            }
        }

        // Marquer qu'un rechargement est nécessaire pour nettoyer les données persistantes
        sessionStorage.setItem('needsReload', 'true');

        history.push('/');
    };

    // Called when the user plays a card
    const playOneCard = (card: CardProps, seatNumber: string) => {
        if (socket && currentTableRef.current) {
            socket.emit(PLAY_ONE_CARD, {
                tableId: currentTableRef.current.id,
                seatId: seatNumber,
                playedCard: card,
            });
        }
        // If the card being played was "elevated," reset that
        const cardKey = `${seatNumber}-${card.suit}-${card.rank}`;
        if (elevatedCard === cardKey) {
            setElevatedCard(null);
        }
    };

    // Called when user sends a chat message
    const sendMessage = (message: string, seatId: string | null) => {
        if (!currentTableRef.current || !socket) return;
        if (message.trim() === '') return;
        socket.emit(SEND_CHAT_MESSAGE, {
            tableId: currentTableRef.current.id,
            seatId: seatId,
            message,
        });
    };

    // Called when user stands up
    const standUp = () => {
        if (currentTableRef.current && socket) {
            socket.emit(STAND_UP, currentTableRef.current.id);
        }
        setIsPlayerSeated(false);
        setSeatId(null);
    };

    // Called when user sits down
    const sitDown = (tableId: string, seatId: string, amount: number) => {
        if (socket) {
            socket.emit(SIT_DOWN, { tableId, seatId, amount });
            setIsPlayerSeated(true);
            setSeatId(seatId);
        }
    };

    const rebuy = (tableId: string, seatNumber: string, amount: number) => {
        if (socket) {
            socket.emit(REBUY, { tableId, seatId: seatNumber, amount });
        }
    };

    // Called when the user calls the pot
    const call = () => {
        if (currentTableRef.current && socket) {
            socket.emit(CALL, currentTableRef.current.id);
        }
    };

    // Called when the user checks
    const check = () => {
        if (currentTableRef.current && socket) {
            socket.emit(CHECK, currentTableRef.current.id);
        }
    };

    // Called when user folds
    const fold = () => {
        if (currentTableRef.current && socket) {
            socket.emit(FOLD, currentTableRef.current.id);
        }
    };

    // Called when user raises
    const raise = (amount: number) => {
        if (currentTableRef.current && socket) {
            socket.emit(RAISE, {
                tableId: currentTableRef.current.id,
                amount,
            });
        }
    };

    // Called when user shows down
    const showDown = () => {
        if (currentTableRef.current && seatId && socket) {
            socket.emit(SHOW_DOWN, {
                tableId: currentTableRef.current.id,
                seatId,
            });
        }
    };

    // Called to join a table
    const joinTable = (table: JoinTableProps) => {
        if (!socket) return;
        socket.emit(JOIN_TABLE, table);
    };

    // Called to leave the table or clean up state
    const handleTableLeftWrapper = () => {
        setCurrentTable(null);
        setIsPlayerSeated(false);
        setSeatId(null);
        loadUser(localStorage.token);
        setMessages([]);
        setTablesList((prevList) =>
            prevList.filter((t) => t.id !== currentTableRef.current?.id)
        );
    };

    // Called when a seat played a card
    const handlePlayedCard = ({ tables, tableId }: TableEventPayload) => {
        if (!tables || !tableId) return;

        let tablesObj: { [key: string]: Table } = {};

        // If array
        if (Array.isArray(tables)) {
            for (const t of tables) {
                if (t?.id) {
                    tablesObj[t.id] = t;
                }
            }
        } else {
            // If object
            tablesObj = tables;
        }

        if (!tablesObj[tableId]) return;

        setCurrentTables(tablesObj);
        setCurrentTable(tablesObj[tableId]);
        setTurnStartTime(Date.now());
    };

    // Called when a seat shows down
    const handleShowDownWrapper = ({ tables, tableId }: TableEventPayload) => {
        if (!tables || !tableId) return;

        let tablesObj: { [key: string]: Table } = {};

        if (Array.isArray(tables)) {
            for (const t of tables) {
                if (t?.id) {
                    tablesObj[t.id] = t;
                }
            }
        } else {
            tablesObj = tables;
        }

        setCurrentTables(tablesObj);
        setCurrentTable(tablesObj[tableId]);
    };

    // Called when a chat message is received
    const handleChatMessage = ({ tables, tableId }: TableEventPayload) => {
        if (!tables || !tableId) return;

        let tablesObj: { [key: string]: Table } = {};

        // If array
        if (Array.isArray(tables)) {
            for (const t of tables) {
                if (t?.id) {
                    tablesObj[t.id] = t;
                }
            }
        } else {
            tablesObj = tables;
        }
        setCurrentTables(tablesObj);
        setCurrentTable(tablesObj[tableId]);
    };

    // Called when user joined a table
    const handleTableJoined = (payload: any) => {
        const { tables, id: tableId } = payload || {};
        if (!tables) return;

        let tablesObj: { [key: string]: Table } = {};

        if (Array.isArray(tables)) {
            for (const t of tables) {
                if (t?.id) {
                    tablesObj[t.id] = t;
                }
            }
        } else {
            tablesObj = tables;
        }

        setCurrentTables(tablesObj);
        setCurrentTable(tablesObj[tableId]);

        if (tablesObj[tableId].players) {
            const player = tablesObj[tableId].players.find((p) => p.id === userId);
            if (player) {
                // Ajouter ou mettre à jour la table dans isOnTables
                setIsOnTables(prev => {
                    const updated = prev.filter(table => table.tableId !== tableId);
                    return [...updated, { tableId, isOnTable: true }];
                });

                // Mettre à jour le localStorage
                const storedTables = localStorage.getItem('isOnTables');
                let parsedTables = [];
                if (storedTables) {
                    try {
                        parsedTables = JSON.parse(storedTables);
                    } catch (error) {
                        parsedTables = [];
                    }
                }
                const updatedTables = parsedTables.filter((table: any) => table.tableId !== tableId);
                updatedTables.push({ tableId, isOnTable: true });
                localStorage.setItem('isOnTables', JSON.stringify(updatedTables));
            } else {
                // Retirer la table de isOnTables
                setIsOnTables(prev => prev.filter(table => table.tableId !== tableId));

                const storedTables = localStorage.getItem('isOnTables');
                if (storedTables) {
                    try {
                        const parsedTables = JSON.parse(storedTables);
                        const updatedTables = parsedTables.filter((table: any) => table.tableId !== tableId);
                        if (updatedTables.length > 0) {
                            localStorage.setItem('isOnTables', JSON.stringify(updatedTables));
                        } else {
                            localStorage.removeItem('isOnTables');
                        }
                    } catch (error) {
                        localStorage.removeItem('isOnTables');
                    }
                }
            }
        }

        if (getPlayerSeat(tablesObj[tableId], userId)) {
            const seatNumber = getPlayerSeat(tablesObj[tableId], userId);
            seatNumber && sitDown(tableId, seatNumber, tablesObj[tableId].seats[seatNumber].bet);
        }
    };

    const getPlayerSeat = (table: Table, userId: string): string | null => {
        for (const [seatId, seat] of Object.entries(table.seats)) {
            if (seat && seat.player && seat.player.id === userId) {
                return seatId;
            }
        }
        return null;
    }

    // Called when the server updates the table
    const handleTableUpdated = ({ table, message }: TableUpdatedPayload) => {
        setCurrentTable(table);
        if (message) {
            addMessage(message);
        }
    };

    const handleRefreshChat = ({ table }: TableUpdatedPayload) => {
        setCurrentTable(table);
        setRefresh(true);
        setTimeout(() => {
            setRefresh(false);
        }, 5)
    };

    // The missing functions from the original GameContext
    const joinTableByLink = async (_link: string): Promise<boolean> => {
        // No-op for now
        return true;
    };

    const injectDebugHand = (_seatNumber: string) => {
        // No-op for now
    };

    // Listen to socket events
    useEffect(() => {
        if (!socket || !userId) {
            return;
        }

        socket.on(TABLE_UPDATED, handleTableUpdated);
        socket.on(TABLE_JOINED, handleTableJoined);
        socket.on(TABLE_LEFT, handleTableLeftWrapper);
        socket.on(PLAYED_CARD, handlePlayedCard);
        socket.on(SHOW_DOWN, handleShowDownWrapper);
        socket.on(CHAT_MESSAGE_RECEIVED, handleChatMessage);
        socket.on(REFRESH_CHAT, handleRefreshChat);

        return () => {
            //
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, userId]);

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
                leaveTable,
                sitDown,
                standUp,
                addMessage,
                fold,
                check,
                call,
                raise,
                rebuy,
                getNameTagPosition: (seatId: string) => {
                    const seat = currentTable?.seats[seatId];
                    if (seatId === "4") {
                        switch (seat?.hand.length) {
                            case 0: {
                                if (currentTable?.handOver &&
                                    seat?.lastAction &&
                                    seat.lastAction !== 'PLAY_ONE_CARD') {
                                    return { bottom: '-3vh', right: '5.5vw' };
                                }
                                return { bottom: '-5.5vh', right: '3.5vw' };
                            }
                            case 1:
                                return { bottom: '-5.5vh', right: '3.5vw' };
                            case 2:
                                return { bottom: '-5.5vh', right: '3.5vw' };
                            case 3:
                                return { bottom: '-5.5vh', right: '3.5vw' };
                            case 4:
                                return { bottom: '-5.5vh', right: '3.5vw' };
                            case 5:
                                return { bottom: '-5.5vh', right: '3.5vw' };
                            default:
                                return {};
                        }
                    } else {
                        switch (seat?.hand.length) {
                            case 0: {
                                if (currentTable?.handOver &&
                                    seat?.lastAction &&
                                    seat.lastAction !== 'PLAY_ONE_CARD') {
                                    return { top: '-8.5vh', right: '5.5vw' };
                                }
                                return { top: '-10.5vh', right: '3.5vw' };
                            }
                            case 1:
                                return { top: '-6.5vh', right: '6.5vw' };
                            case 2:
                                return { top: '-6.5vh', right: '6.5vw' };
                            case 3:
                                return { top: '-6vh', right: '6.5vw' };
                            case 4:
                                return { top: '-6vh', right: '8vw' };
                            case 5:
                                return { top: '-6.5vh', right: '8.5vw' };
                            default:
                                return {};
                        }
                    }
                },
                getPlayedCardsPosition: (seatId: string) => {
                    const seat = currentTable?.seats[seatId];
                    const numberOfCards = seat?.hand.length;

                    switch (seatId) {
                        case '1':
                            switch (numberOfCards) {
                                case 0:
                                    return { bottom: '-5vh', left: '7vw' };
                                case 1:
                                    return { bottom: '-5vh', left: '6vw' };
                                case 2:
                                    return { bottom: '-5vh', left: '5vw' };
                                case 3:
                                    return { bottom: '-5vh', left: '4vw' };
                                case 4:
                                    return { bottom: '-5vh', left: '3vw' };
                                case 5:
                                    return { bottom: '-5vh', left: '2vw' };
                                default:
                                    return {};
                            }
                        case '2':
                            switch (numberOfCards) {
                                case 0:
                                    return { top: '7.5vh', left: '9vw' };
                                case 1:
                                    return { top: '7.5vh', left: '8vw' };
                                case 2:
                                    return { top: '7.5vh', left: '7vw' };
                                case 3:
                                    return { top: '7.5vh', left: '6vw' };
                                case 4:
                                    return { top: '7.5vh', left: '5vw' };
                                case 5:
                                    return { top: '7.5vh', left: '4vw' };
                                default:
                                    return {};
                            }
                        case '3':
                            switch (numberOfCards) {
                                case 0:
                                    return { bottom: '-5vh', right: '10vw' };
                                case 1:
                                    return { bottom: '-5vh', right: '11vw' };
                                case 2:
                                    return { bottom: '-5vh', right: '12vw' };
                                case 3:
                                    return { bottom: '-5vh', right: '13vw' };
                                case 4:
                                    return { bottom: '-5vh', right: '14vw' };
                                case 5:
                                    return { bottom: '-5vh', right: '15vw' };
                                default:
                                    return {};
                            }

                        case '4':
                            switch (numberOfCards) {
                                case 0:
                                    return { bottom: '15vh', left: '5vw' };
                                case 1:
                                    return { bottom: '15vh', left: '4vw' };
                                case 2:
                                    return { bottom: '15vh', left: '3vw' };
                                case 3:
                                    return { bottom: '15vh', left: '2vw' };
                                case 4:
                                    return { bottom: '15vh', left: '1vw' };
                                case 5:
                                    return { bottom: '15vh' };
                                default:
                                    return {};
                            }

                        default:
                            return {};
                    }
                },
                getChipsPillPosition: (seatId: string) => {
                    const seat = currentTable?.seats[seatId];
                    switch (seatId) {
                        case '1':
                            return { bottom: '-15vh', left: '2vw' };
                        case '2':
                            if (currentTable?.handOver &&
                                seat?.lastAction &&
                                seat.lastAction !== 'PLAY_ONE_CARD') {
                                return { top: '10vh' };
                            }
                            return { top: '7vh' };
                        case '3':
                            if (seat?.hand.length && seat?.hand.length > 0) {
                                return { bottom: '-15vh', right: '12vw' };
                            }
                            return { bottom: '-15vh', right: '2vw' };
                        case '4':
                            return { bottom: '7vh' };
                        default:
                            return {};
                    }
                },
                playOneCard,
                setElevatedCard,
                showDown,
                sendMessage,
                // added these to fix missing properties
                joinTableByLink,
                injectDebugHand,
            }}
        >
            {children}
        </GameContext.Provider>
    );
};

export default GameState;
