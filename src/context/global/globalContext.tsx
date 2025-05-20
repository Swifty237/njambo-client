import { createContext } from 'react';

const globalContext = createContext({
    isLoading: true,
    setIsLoading: (value: React.SetStateAction<boolean>) => { },
    userName: '',
    setUserName: (value: React.SetStateAction<string>) => { },
    email: '',
    setEmail: (value: React.SetStateAction<string>) => { },
    chipsAmount: 0,
    setChipsAmount: (value: React.SetStateAction<number>) => { },
    id: '',
    setId: (value: React.SetStateAction<string>) => { },
    tables: '',
    setTables: (value: React.SetStateAction<string>) => { },
    players: '',
    setPlayers: (value: React.SetStateAction<string>) => { },

});

export default globalContext;
