import { createContext } from 'react';
import { Table } from '../../types/SeatTypesProps';

interface TableContextType {
    isOnTable: boolean;
    currentTable: Table | null;
    tableError: string | null;
    isLoading: boolean;
    createTableRequest: (table: Table) => Promise<boolean>;
    joinTableByLinkRequest: () => Promise<boolean>;
    leaveTableRequest: () => Promise<void>;
    clearTableError: () => void;
}

const tableContext = createContext<TableContextType>({
    isOnTable: false,
    currentTable: null,
    tableError: null,
    isLoading: false,
    createTableRequest: async () => false,
    joinTableByLinkRequest: async () => false,
    leaveTableRequest: async () => { },
    clearTableError: () => { },
});

export default tableContext;
