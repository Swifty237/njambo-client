import { createContext } from 'react';
import { Table, isOnTablesProps } from '../../types/SeatTypesProps';

interface TableContextType {
    isOnTables: isOnTablesProps[];
    currentTable: Table | null;
    tableError: string | null;
    isLoading: boolean;
    setIsOnTables: (value: React.SetStateAction<isOnTablesProps[]>) => void,
    createTableRequest: (table: Table) => Promise<boolean>;
    joinTableByLinkRequest: () => Promise<boolean>;
    leaveTableRequest: (tableId?: string) => Promise<void>;
    clearTableError: () => void;
    isOnTable: (tableId: string) => boolean;
}

const tableContext = createContext<TableContextType>({
    isOnTables: [],
    currentTable: null,
    tableError: null,
    isLoading: false,
    setIsOnTables: () => { },
    createTableRequest: async () => false,
    joinTableByLinkRequest: async () => false,
    leaveTableRequest: async () => { },
    clearTableError: () => { },
    isOnTable: () => false,
});

export default tableContext;
