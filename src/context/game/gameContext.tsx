import { createContext } from 'react';

interface GameContextType {
    standUp: any;
    seatId: any;
    rebuy: any;
}

const gameContext = createContext<GameContextType>({
    standUp: () => { },
    seatId: () => { },
    rebuy: () => { },
});

export default gameContext;
