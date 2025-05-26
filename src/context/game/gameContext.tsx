import { createContext } from 'react';

interface CardProps {
    suit: string,
    rank: string
}

interface Player {
    name: string;
}

interface SeatData {
    id: string;
    turn: boolean;
    stack: number;
    sittingOut: boolean;
    player: Player;
    bet: number;
    hand: CardProps[];
    lastAction?: string;
}

interface Table {
    id: string;
    name: string;
    seats: { [seatId: string]: SeatData };
    limit: number;
    minBet: number;
    callAmount: number;
    pot: number;
    minRaise: number;
    board: CardProps[];
    winMessages: string;
    button: string;
    handOver: boolean;
}


interface GameContextType {
    messages: string[],
    currentTable: Table | null,
    isPlayerSeated: boolean,
    seatId: string | null,
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
    injectDebugHand: (seatNumber: string) => void
}

const gameContext = createContext<GameContextType>({
    messages: [],
    currentTable: null,
    isPlayerSeated: false,
    seatId: '',
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
    injectDebugHand: () => { }
});

export default gameContext;
