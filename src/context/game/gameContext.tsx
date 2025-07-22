import { createContext } from 'react';
import { CardProps, JoinTableProps, Table } from '../../types/SeatTypesProps';

// interface PositionProps {
//     top?: string;
//     right?: string;
//     bottom?: string;
//     left?: string
// }

interface GameContextType {
    messages: string[],
    currentTable: Table | null,
    isPlayerSeated: boolean,
    seatId: string | null,
    elevatedCard: string | null,
    tablesList: Table[],
    refresh: boolean,
    setRefresh: (value: React.SetStateAction<boolean>) => void,
    setTablesList: (value: React.SetStateAction<Table[]>) => void,
    joinTable: (table: JoinTableProps) => void,
    joinTableByLink: (link: string) => Promise<boolean>,
    leaveTable: () => void,
    sitDown: (tableId: string, seatId: string, amount: number) => void,
    standUp: () => void,
    addMessage: (message: string) => void,
    fold: () => void,
    check: () => void,
    call: () => void,
    raise: (amount: number) => void,
    rebuy: (tableId: string, seatId: string, amount: number) => void,
    injectDebugHand: (seatNumber: string) => void,
    getNameTagPosition: (seatId: string) => { top?: string, right?: string, bottom?: string, left?: string },
    getPlayedCardsPosition: (seatId: string) => { top?: string, right?: string, bottom?: string, left?: string },
    getChipsPillPosition: (seatId: string) => { top?: string, right?: string, bottom?: string, left?: string },
    playOneCard: (card: CardProps, seatNumber: string) => void;
    setElevatedCard: (cardKey: string | null) => void;
    showDown: () => void;
    sendMessage: (message: string, seatId: string | null) => void;
}

const gameContext = createContext<GameContextType>({
    messages: [],
    currentTable: null,
    isPlayerSeated: false,
    seatId: '',
    elevatedCard: null,
    tablesList: [],
    refresh: false,
    setRefresh: () => { },
    setTablesList: () => { },
    joinTable: () => { },
    joinTableByLink: async () => false,
    leaveTable: () => { },
    sitDown: () => { },
    standUp: () => { },
    addMessage: () => { },
    fold: () => { },
    check: () => { },
    call: () => { },
    raise: () => { },
    rebuy: () => { },
    injectDebugHand: () => { },
    getNameTagPosition: () => ({}),
    getPlayedCardsPosition: () => ({}),
    getChipsPillPosition: () => ({}),
    playOneCard: () => { },
    setElevatedCard: () => { },
    showDown: () => { },
    sendMessage: () => { },
});

export default gameContext;
