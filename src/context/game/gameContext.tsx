import { createContext } from 'react';

interface GameContextType {
    messages: string[],
    currentTable: any,
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
});

export default gameContext;
