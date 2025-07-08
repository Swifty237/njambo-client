import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    CALL, CHECK, FOLD, JOIN_TABLE, LEAVE_TABLE, RAISE, REBUY,
    SIT_DOWN, STAND_UP, TABLE_JOINED, TABLE_LEFT, TABLE_UPDATED,
    PLAY_ONE_CARD, PLAYED_CARD, SHOW_DOWN, SEND_CHAT_MESSAGE,
    CHAT_MESSAGE_RECEIVED,
} from '../../pokergame/actions';
import authContext from '../auth/authContext';
import socketContext from '../websocket/socketContext';
import globalContext from '../global/globalContext';
import GameContext from './gameContext';
import { Table, TableUpdatedPayload, TableEventPayload, CardProps, JoinTableProps, Seat } from '../../types/SeatTypesProps';

interface GameStateProps {
    children: React.ReactNode
}

const GameState = ({ children }: GameStateProps) => {
    const history = useHistory();
    const { socket, cleanUp } = useContext(socketContext);
    const { loadUser } = useContext(authContext);
    const { id: userId, userName } = useContext(globalContext);

    const [tablesList, setTablesList] = useState<Table[]>([])

    const updatePlayerSeatStatus = (table: Table, context: string) => {
        let foundPlayerSeat = false;
        let foundPlayerTurn = false;

        if (table.seats) {
            Object.keys(table.seats).forEach(currentSeatId => {
                const seat = table.seats[currentSeatId];
                if (seat && seat.player) {
                    const isOurUser = seat.player.userId === userId ||
                        (seat.player.name === userName && !seat.player.userId);

                    if (isOurUser) {
                        foundPlayerSeat = true;
                        foundPlayerTurn = seat.turn || false;

                        setSeatId(currentSeatId);
                        setIsPlayerSeated(true);

                        localStorage.setItem('seatId', currentSeatId);
                        localStorage.setItem('isPlayerSeated', 'true');
                    }
                }
            });
        }

        if (!foundPlayerSeat && (isPlayerSeated || localStorage.getItem('isPlayerSeated'))) {
            setIsPlayerSeated(false);
            setSeatId(null);
            localStorage.removeItem('seatId');
            localStorage.removeItem('isPlayerSeated');
        }

        return { foundPlayerSeat, foundPlayerTurn };
    };

    const [messages, setMessages] = useState<string[]>([]);
    const [currentTable, setCurrentTable] = useState<Table | null>(() => {
        const savedTable = localStorage.getItem('currentTable');
        if (savedTable) {
            try {
                return JSON.parse(savedTable);
            } catch (error) {
                localStorage.removeItem('currentTable');
                return null;
            }
        }
        return null;
    });
    const [currentTables, setCurrentTables] = useState<{ [key: string]: Table } | null>(null);
    const [isPlayerSeated, setIsPlayerSeated] = useState(false);
    const [seatId, setSeatId] = useState<string | null>(null);
    const [elevatedCard, setElevatedCard] = useState<string | null>(null);
    const currentTableRef = React.useRef(currentTable);
    const currentTablesRef = React.useRef(currentTables);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        currentTableRef.current = currentTable;
        currentTablesRef.current = currentTables;

        if (currentTable) {
            localStorage.setItem('currentTable', JSON.stringify(currentTable));
        } else {
            localStorage.removeItem('currentTable');
        }
    }, [currentTable, seatId, isPlayerSeated]);

    useEffect(() => {
        if (!socket || !userId) return;

        const cleanup = () => {
            window.removeEventListener('beforeunload', leaveTable);
        };

        const handleTableUpdated = ({ table, message }: TableUpdatedPayload) => {
            const { foundPlayerSeat, foundPlayerTurn } = updatePlayerSeatStatus(table, 'table update');
            setCurrentTable(table);
            localStorage.setItem('currentTable', JSON.stringify(table));
            message && addMessage(message);
        };

        const handleTableJoined = (payload: any) => {
            const { tables, id: tableId } = payload || {};

            if (tables && Array.isArray(tables)) {
                const tablesObj: { [key: string]: any } = {};
                tables.forEach((table: any) => {
                    if (table && table.id) {
                        tablesObj[table.id] = table;
                    }
                });

                setCurrentTables(tablesObj);

                if (tableId && tablesObj[tableId]) {
                    const table = tablesObj[tableId];
                    setCurrentTable(table);
                    localStorage.setItem('currentTable', JSON.stringify(table));
                } else {
                    const firstTableId = Object.keys(tablesObj)[0];
                    if (firstTableId) {
                        const table = tablesObj[firstTableId];
                        setCurrentTable(table);
                        localStorage.setItem('currentTable', JSON.stringify(table));
                    }
                }
            } else if (tables && typeof tables === 'object') {
                setCurrentTables(tables);
                if (tableId && tables[tableId]) {
                    const table = tables[tableId];
                    setCurrentTable(table);
                    localStorage.setItem('currentTable', JSON.stringify(table));
                } else {
                    const firstTableId = Object.keys(tables)[0];
                    if (firstTableId) {
                        const table = tables[firstTableId];
                        setCurrentTable(table);
                        localStorage.setItem('currentTable', JSON.stringify(table));
                    }
                }
            }
        };

        const handleTableLeft = () => {
            setCurrentTable(null);
            localStorage.removeItem('currentTable');
            localStorage.removeItem('storedLink');
            localStorage.removeItem('seatId');
            localStorage.removeItem('isPlayerSeated');
            setIsPlayerSeated(false);
            setSeatId(null);
            loadUser(localStorage.token);
            setMessages([]);

            setTablesList(prevList => prevList.filter(table =>
                table.id !== currentTableRef.current?.id
            ));
        };

        const handlePlayedCard = ({ tables, tableId }: TableEventPayload) => {
            if (!tables || !tableId) {
                return;
            }

            let tablesObj = Array.isArray(tables)
                ? tables.reduce((acc: any, table: any) => {
                    if (table && table.id) {
                        acc[table.id] = table;
                    }
                    return acc;
                }, {})
                : tables;

            if (!tablesObj[tableId]) {
                return;
            }

            setCurrentTables(tablesObj);
            const updatedTable = tablesObj[tableId];

            if (updatedTable?.seats) {
                updatePlayerSeatStatus(updatedTable, 'carte jouée');
            }

            setCurrentTable(updatedTable);
            localStorage.setItem('currentTable', JSON.stringify(updatedTable));
        };

        const handleShowDown = ({ tables, tableId }: TableEventPayload) => {
            if (!tables || !tableId || !tables[tableId]) {
                return;
            }

            setCurrentTables(tables);
            const updatedTable = tables[tableId];

            if (updatedTable?.seats) {
                updatePlayerSeatStatus(updatedTable, 'showdown');
            }

            setCurrentTable(updatedTable);
            localStorage.setItem('currentTable', JSON.stringify(updatedTable));
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
                localStorage.setItem('currentTable', JSON.stringify(targetTable));
            }
        };

        socket.on(TABLE_UPDATED, handleTableUpdated);
        socket.on(TABLE_JOINED, handleTableJoined);
        socket.on(TABLE_LEFT, handleTableLeft);
        socket.on(PLAYED_CARD, handlePlayedCard);
        socket.on(SHOW_DOWN, handleShowDown);
        socket.on(CHAT_MESSAGE_RECEIVED, handleChatMessage);

        return cleanup;
    }, [socket, userId, userName, loadUser]);

    const joinTable = (table: JoinTableProps) => {
        if (!socket || !socket.id) {
            return;
        }
        socket.emit(JOIN_TABLE, table);
    };

    const leaveTable = () => {
        localStorage.removeItem('currentTable');
        localStorage.removeItem('isOnTable');
        localStorage.removeItem('storedLink');
        isPlayerSeated && standUp();
        currentTableRef.current?.id && socket.emit(LEAVE_TABLE, currentTableRef.current.id);
        cleanUp();
        history.push('/');
    };

    const sitDown = (tableId: string, seatId: string, amount: number) => {
        socket.emit(SIT_DOWN, { tableId, seatId, amount });
        setIsPlayerSeated(true);
        setSeatId(seatId);
    };

    const standUp = () => {
        currentTableRef.current?.id && socket.emit(STAND_UP, currentTableRef.current.id);
        setIsPlayerSeated(false);
        setSeatId(null);
    };

    const getHandsPosition = (seatId: string) => {
        switch (seatId) {
            case "1":
                return { bottom: "-5vh", left: "2vw" };
            case "2":
                return { left: "2vw" };
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
    };

    const injectDebugHand = (seatNumber: string) => {
        if (!currentTable) return;

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
        localStorage.setItem('currentTable', JSON.stringify(updatedTable));
    };

    const joinTableByLink = async (link: string): Promise<boolean> => {
        try {
            const decodedData = JSON.parse(atob(link));
            if (!decodedData.id || !decodedData.name) {
                return false;
            }
            localStorage.setItem('storedLink', link);
            return true;
        } catch (error) {
            return false;
        }
    };

    const playOneCard = (card: CardProps, seatNumber: string) => {
        if (currentTable) {
            const currentSeat = currentTable.seats[seatNumber];
            if (currentSeat?.hand) {
                if (socket && currentTable) {
                    socket.emit(PLAY_ONE_CARD, {
                        tableId: currentTable.id,
                        seatId: seatNumber,
                        playedCard: card,
                    });
                }
            }
        }

        const cardKey = `${seatNumber}-${card.suit}-${card.rank}`;
        if (elevatedCard === cardKey) {
            setElevatedCard(null);
        }
    };

    const sendMessage = (message: string, seatId: string | null) => {
        if (currentTable && message !== "") {
            socket.emit(SEND_CHAT_MESSAGE, {
                tableId: currentTable.id,
                seatId: seatId || null,
                message,
            });
        }
    };

    const showDown = () => {
        if (currentTableRef.current && seatId) {
            socket.emit(SHOW_DOWN, {
                tableId: currentTableRef.current.id,
                seatId: seatId
            });
        }
    };

    const addMessage = (message: string) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    const fold = () => {
        currentTableRef.current?.id && socket.emit(FOLD, currentTableRef.current.id);
    };

    const check = () => {
        currentTableRef.current?.id && socket.emit(CHECK, currentTableRef.current.id);
    };

    const call = () => {
        currentTableRef.current?.id && socket.emit(CALL, currentTableRef.current.id);
    };

    const raise = (amount: number) => {
        currentTableRef.current?.id && socket.emit(RAISE, {
            tableId: currentTableRef.current.id,
            amount
        });
    };

    const rebuy = (tableId: string, seatId: string, amount: number) => {
        socket.emit(REBUY, { tableId, seatId, amount });
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
