import { createContext } from 'react';
import { CardProps, SeatData, Table } from '../../types/SeatTypesProps';


interface PositionProps {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string
}

interface GameContextType {
    messages: string[],
    currentTable: Table | null,
    isPlayerSeated: boolean,
    seatId: string | null,
    elevatedCard: string | null;
    joinTable: (tableId: any) => void,
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
    getAvatarPosition: (id: string | null) => PositionProps,
    getHandPosition: (id: string | null) => PositionProps,
    getPlayedCardsPosition: (id: string | null, seat: SeatData) => PositionProps | undefined
    playCard: (card: CardProps, seatNumber: string) => void;
    setElevatedCard: (cardKey: string | null) => void;
}

const position: PositionProps = {
    top: "",
    right: "",
    left: "",
    bottom: ""
}

const gameContext = createContext<GameContextType>({
    messages: [],
    currentTable: null,
    isPlayerSeated: false,
    seatId: '',
    elevatedCard: '',
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
    getAvatarPosition: () => position,
    getHandPosition: () => position,
    getPlayedCardsPosition: () => position,
    playCard: () => { },
    setElevatedCard: () => { },
});

export default gameContext;
