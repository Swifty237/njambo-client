import { createContext } from 'react';
import { CardProps, Table } from '../../types/SeatTypesProps';


// interface PositionProps {
//     top?: string;
//     right?: string;
//     bottom?: string;
//     left?: string
// }

export interface TatamiProps {
    id: string;
    name: string;
    bet: string;
    isPrivate: boolean;
    createdAt: string;
    link: string;
}

interface GameContextType {
    messages: string[],
    currentTable: Table | null,
    isPlayerSeated: boolean,
    seatId: string | null,
    elevatedCard: string | null,
    tatamiDataList: TatamiProps[],
    refresh: boolean,
    setRefresh: (value: React.SetStateAction<boolean>) => void,
    setTatamiDataList: (value: React.SetStateAction<TatamiProps[]>) => void,
    joinTable: (tatamiData: TatamiProps) => void,
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
    getHandsPosition: (seatId: string) => { top?: string, right?: string, bottom?: string, left?: string },
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
    tatamiDataList: [],
    refresh: false,
    setRefresh: () => { },
    setTatamiDataList: () => { },
    joinTable: () => { },
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
    getHandsPosition: () => ({}),
    playOneCard: () => { },
    setElevatedCard: () => { },
    showDown: () => { },
    sendMessage: () => { },
});

export default gameContext;
