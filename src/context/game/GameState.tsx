// Copier le contenu de GameState_withUserId.tsx
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
} from '../../pokergame/actions';
import authContext from '../auth/authContext';
import socketContext from '../websocket/socketContext';
import globalContext from '../global/globalContext';
import GameContext from './gameContext';
import { Table, TableUpdatedPayload, TableEventPayload, CardProps, JoinTableProps } from '../../types/SeatTypesProps';

interface GameStateProps {
    children: React.ReactNode
}

const GameState = ({ children }: GameStateProps) => {
    const history = useHistory();
    const { socket } = useContext(socketContext);
    const { loadUser } = useContext(authContext);
    const { id: userId, userName } = useContext(globalContext);

    const [tablesList, setTablesList] = useState<Table[]>([])
    const [messages, setMessages] = useState<string[]>([]);
    const [currentTable, setCurrentTable] = useState<Table | null>(null);
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
        // eslint-disable-next-line
    }, [currentTable]);

    // Surveiller les changements du localStorage
    useEffect(() => {
        // Surveiller les événements de storage
        const handleStorageChange = (e: StorageEvent) => {
            console.log('🔄 [GameState] localStorage changed:', e.key, e.oldValue, '->', e.newValue);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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

            // Analyser les changements de sièges
            if (table.seats) {
                console.log('🪑 [GameState] TABLE_UPDATED - analyse des sièges:');
                Object.keys(table.seats).forEach(seatId => {
                    const seat = table.seats[seatId];
                    if (seat && seat.player) {
                        console.log(`🪑 [GameState] TABLE_UPDATED - siège ${seatId} occupé par:`, {
                            playerId: seat.player.userId,
                            playerName: seat.player.name,
                            stack: seat.stack
                        });

                        // Vérifier si c'est notre utilisateur (par userId ou par nom si userId manque)
                        const isOurUser = seat.player.userId === userId ||
                            (seat.player.name === userName && !seat.player.userId);

                        console.log(`🔍 [GameState] TABLE_UPDATED - vérification utilisateur siège ${seatId}:`, {
                            playerUserId: seat.player.userId,
                            playerName: seat.player.name,
                            currentUserId: userId,
                            currentUserName: userName,
                            isOurUser
                        });

                        if (isOurUser) {
                            console.log(`✅ [GameState] TABLE_UPDATED - notre utilisateur trouvé au siège ${seatId}`);
                            const storedSeatId = localStorage.getItem('seatId');
                            if (storedSeatId !== seatId) {
                                console.log(`🔄 [GameState] TABLE_UPDATED - mise à jour seatId: ${storedSeatId} -> ${seatId}`);
                                setSeatId(seatId);
                                localStorage.setItem('seatId', seatId);
                            }
                            if (!isPlayerSeated) {
                                console.log('🔄 [GameState] TABLE_UPDATED - mise à jour isPlayerSeated: false -> true');
                                setIsPlayerSeated(true);
                                localStorage.setItem('isPlayerSeated', 'true');
                            }
                        }
                    } else {
                        console.log(`🪑 [GameState] TABLE_UPDATED - siège ${seatId} vide`);

                        // Vérifier si c'était notre siège
                        const storedSeatId = localStorage.getItem('seatId');
                        if (storedSeatId === seatId && isPlayerSeated) {
                            console.log(`❌ [GameState] TABLE_UPDATED - notre siège ${seatId} est maintenant vide`);
                            setIsPlayerSeated(false);
                            setSeatId(null);
                            localStorage.removeItem('seatId');
                            localStorage.removeItem('isPlayerSeated');
                        }
                    }
                });
            }

            setCurrentTable(table);
            message && addMessage(message);
        };

        const handleTableJoined = (payload: any) => {
            console.log('🎯 [GameState] TABLE_JOINED reçu - payload complet:', payload);
            console.log('🔍 [GameState] TABLE_JOINED - type de payload:', typeof payload);
            console.log('🔍 [GameState] TABLE_JOINED - clés du payload:', Object.keys(payload || {}));

            // Le serveur envoie {tables: Array, id: string} au lieu de {tables: Object, tableId: string}
            const { tables, id: tableId } = payload || {};
            console.log('🎯 [GameState] TABLE_JOINED - tableId extrait (depuis id):', tableId);
            console.log('🎯 [GameState] TABLE_JOINED - tables extraites:', tables);
            console.log('🎯 [GameState] TABLE_JOINED - type de tables:', typeof tables);

            if (tables && Array.isArray(tables)) {
                console.log('🎯 [GameState] TABLE_JOINED - tables est un Array de longueur:', tables.length);

                // Convertir l'array en objet avec l'id comme clé
                const tablesObj: { [key: string]: any } = {};
                tables.forEach((table: any) => {
                    if (table && table.id) {
                        tablesObj[table.id] = table;

                        // Analyser les sièges de chaque table
                        console.log('🪑 [GameState] TABLE_JOINED - analyse table:', table.id);
                        if (table.seats) {
                            console.log('🪑 [GameState] TABLE_JOINED - sièges disponibles:', Object.keys(table.seats));
                            Object.keys(table.seats).forEach(seatId => {
                                const seat = table.seats[seatId];
                                if (seat && seat.player) {
                                    console.log(`🪑 [GameState] TABLE_JOINED - siège ${seatId} occupé par:`, {
                                        playerId: seat.player.userId,
                                        playerName: seat.player.name,
                                        stack: seat.stack
                                    });
                                } else {
                                    console.log(`🪑 [GameState] TABLE_JOINED - siège ${seatId} vide`);
                                }
                            });
                        } else {
                            console.log('🪑 [GameState] TABLE_JOINED - aucun siège dans la table');
                        }
                    }
                });

                console.log('🎯 [GameState] TABLE_JOINED - tables converties en objet:', Object.keys(tablesObj));
                setCurrentTables(tablesObj);

                if (tableId && tablesObj[tableId]) {
                    console.log('✅ [GameState] TABLE_JOINED - table trouvée pour tableId:', tableId);

                    // Vérifier si l'utilisateur était assis avant la reconnexion
                    const storedSeatId = localStorage.getItem('seatId');
                    const storedIsPlayerSeated = localStorage.getItem('isPlayerSeated');
                    console.log('💾 [GameState] TABLE_JOINED - vérification localStorage:', {
                        storedSeatId,
                        storedIsPlayerSeated,
                        currentUserId: userId
                    });

                    // Vérifier si l'utilisateur était assis avant la reconnexion
                    if (storedSeatId && storedIsPlayerSeated === 'true') {
                        const targetTable = tablesObj[tableId];
                        const targetSeat = targetTable.seats?.[storedSeatId];

                        // Vérifier si l'utilisateur est à son siège (par userId ou par nom si userId manque)
                        const isUserAtSeat = targetSeat && targetSeat.player &&
                            (targetSeat.player.userId === userId ||
                                (targetSeat.player.name === userName && !targetSeat.player.userId));

                        console.log('🔍 [GameState] TABLE_JOINED - vérification siège stocké:', {
                            storedSeatId,
                            targetSeat: !!targetSeat,
                            playerInSeat: targetSeat?.player,
                            isUserAtSeat
                        });

                        if (isUserAtSeat) {
                            console.log('✅ [GameState] TABLE_JOINED - utilisateur retrouvé à son siège:', storedSeatId);
                            setIsPlayerSeated(true);
                            setSeatId(storedSeatId);
                        } else {
                            console.log('❌ [GameState] TABLE_JOINED - utilisateur non trouvé à son siège stocké');
                            console.log('⚠️ [GameState] TABLE_JOINED - CONSERVATION du localStorage pour usePlayerSeated');
                            // NE PAS nettoyer le localStorage ici - laisser usePlayerSeated gérer
                            // Le localStorage sera nettoyé par usePlayerSeated si nécessaire
                            setIsPlayerSeated(false);
                            setSeatId(null);
                        }
                    } else {
                        // Pas de données localStorage, chercher si l'utilisateur est assis quelque part
                        console.log('🔍 [GameState] TABLE_JOINED - pas de localStorage, recherche de l\'utilisateur...');
                        const targetTable = tablesObj[tableId];

                        if (targetTable.seats) {
                            Object.keys(targetTable.seats).forEach(seatId => {
                                const seat = targetTable.seats[seatId];
                                if (seat && seat.player) {
                                    const isOurUser = seat.player.userId === userId ||
                                        (seat.player.name === userName && !seat.player.userId);

                                    if (isOurUser) {
                                        console.log(`✅ [GameState] TABLE_JOINED - utilisateur trouvé au siège ${seatId}, sauvegarde...`);
                                        setIsPlayerSeated(true);
                                        setSeatId(seatId);
                                        localStorage.setItem('seatId', seatId);
                                        localStorage.setItem('isPlayerSeated', 'true');
                                    }
                                }
                            });
                        }
                    }

                    setCurrentTable(tablesObj[tableId]);
                } else {
                    console.log('❌ [GameState] TABLE_JOINED - table non trouvée. tableId:', tableId, 'tables disponibles:', Object.keys(tablesObj));

                    // Essayer de prendre la première table disponible
                    const firstTableId = Object.keys(tablesObj)[0];
                    if (firstTableId) {
                        console.log('🔄 [GameState] TABLE_JOINED - utilisation de la première table disponible:', firstTableId);
                        setCurrentTable(tablesObj[firstTableId]);
                    }
                }
            } else if (tables && typeof tables === 'object') {
                // Cas où tables est déjà un objet (ancien format)
                console.log('🎯 [GameState] TABLE_JOINED - tables est un objet:', Object.keys(tables));
                setCurrentTables(tables);

                if (tableId && tables[tableId]) {
                    console.log('✅ [GameState] TABLE_JOINED - table trouvée pour tableId:', tableId);
                    setCurrentTable(tables[tableId]);
                } else {
                    const firstTableId = Object.keys(tables)[0];
                    if (firstTableId) {
                        console.log('🔄 [GameState] TABLE_JOINED - utilisation de la première table disponible:', firstTableId);
                        setCurrentTable(tables[firstTableId]);
                    }
                }
            } else {
                console.log('❌ [GameState] TABLE_JOINED - format de tables non reconnu');
            }
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
        // socket.on(TABLES_UPDATED, handleTablesUpdated);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        console.log('🎯 [GameState] joinTable appelé avec:', table);
        console.log('🔍 [GameState] joinTable - socket disponible:', !!socket);
        console.log('🔍 [GameState] joinTable - socket.id:', socket?.id);
        console.log('🔍 [GameState] joinTable - userId:', userId);
        console.log('🔍 [GameState] joinTable - userName:', userName);

        if (!socket) {
            console.log('❌ [GameState] joinTable - pas de socket');
            return;
        }

        if (!socket.id) {
            console.log('❌ [GameState] joinTable - pas de socket.id');
            return;
        }

        // Vérifier les données localStorage avant de rejoindre
        const storedSeatId = localStorage.getItem('seatId');
        const storedIsPlayerSeated = localStorage.getItem('isPlayerSeated');
        console.log('💾 [GameState] joinTable - localStorage avant JOIN_TABLE:', {
            storedSeatId,
            storedIsPlayerSeated,
            userId: localStorage.getItem('userId'),
            userName: localStorage.getItem('userName')
        });

        // Sauvegarder l'ID utilisateur au lieu du socketId
        if (userId) {
            localStorage.setItem('userId', userId);
        }
        if (userName) {
            localStorage.setItem('userName', userName);
        }

        console.log('📤 [GameState] joinTable - émission JOIN_TABLE avec:', table);
        socket.emit(JOIN_TABLE, table);
    };

    const leaveTable = () => {
        console.log('🚪 [GameState] leaveTable appelé');
        console.log('🔍 [GameState] leaveTable - localStorage avant:', {
            seatId: localStorage.getItem('seatId'),
            isPlayerSeated: localStorage.getItem('isPlayerSeated')
        });

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

        // Vérifier l'état avant de s'asseoir
        console.log('🔍 [GameState] sitDown - état avant:', {
            currentIsPlayerSeated: isPlayerSeated,
            currentSeatId: seatId,
            localStorageSeatId: localStorage.getItem('seatId'),
            localStorageIsPlayerSeated: localStorage.getItem('isPlayerSeated')
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
            localStorageUpdated: true,
            newLocalStorageSeatId: localStorage.getItem('seatId'),
            newLocalStorageIsPlayerSeated: localStorage.getItem('isPlayerSeated')
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
        console.log('🚶 [GameState] standUp appelé');
        console.log('🔍 [GameState] standUp - état avant:', {
            currentIsPlayerSeated: isPlayerSeated,
            currentSeatId: seatId,
            localStorageSeatId: localStorage.getItem('seatId'),
            localStorageIsPlayerSeated: localStorage.getItem('isPlayerSeated'),
            currentTableId: currentTableRef.current?.id
        });

        currentTableRef &&
            currentTableRef.current &&
            socket.emit(STAND_UP, currentTableRef.current.id);

        console.log('📤 [GameState] STAND_UP émis vers le serveur');

        setIsPlayerSeated(false);
        setSeatId(null);
        localStorage.removeItem("seatId");
        localStorage.removeItem("isPlayerSeated");

        console.log('💾 [GameState] standUp - état après nettoyage:', {
            isPlayerSeated: false,
            seatId: null,
            localStorageSeatId: localStorage.getItem('seatId'),
            localStorageIsPlayerSeated: localStorage.getItem('isPlayerSeated')
        });
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
