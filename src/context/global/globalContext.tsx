import { createContext } from 'react';
import { Player, Table } from '../../types/SeatTypesProps';

const globalContext = createContext<{
    isLoading: boolean;
    setIsLoading: (value: React.SetStateAction<boolean>) => void;
    userName: string;
    setUserName: (value: React.SetStateAction<string>) => void;
    email: string;
    setEmail: (value: React.SetStateAction<string>) => void;
    chipsAmount: number;
    setChipsAmount: (value: React.SetStateAction<number>) => void;
    id: string;
    setId: (value: React.SetStateAction<string>) => void;
    tables: Table[];
    setTables: (value: React.SetStateAction<Table[]>) => void;
    players: Player[];
    setPlayers: (value: React.SetStateAction<Player[]>) => void;
}>({
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
    tables: [],
    setTables: (value: React.SetStateAction<Table[]>) => { },
    players: [],
    setPlayers: (value: React.SetStateAction<Player[]>) => { },
});

export default globalContext;
