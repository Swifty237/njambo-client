import { createContext } from 'react';

interface SocketContextType {
    cleanUp: () => void;
    socket: Socket | null;
    socketId: string | null;
}

const socketContext = createContext<SocketContextType>({
    cleanUp: () => { },
    socket: null,
    socketId: ''
});

export default socketContext;
