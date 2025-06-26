import { createContext } from 'react';

interface SocketContextType {
    cleanUp: () => void;
    socket: Socket | null;
    setSocket: (socket: Socket | null) => void;
    socketId: string | null;
}

const socketContext = createContext<SocketContextType>({
    cleanUp: () => { },
    socket: null,
    setSocket: () => { },
    socketId: ''
});

export default socketContext;
