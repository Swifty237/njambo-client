import React, { PropsWithChildren } from 'react';
import TableContext from './tableContext';
import useTable from '../../hooks/useTable';

const TableProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const {
        isOnTables,
        currentTable,
        tableError,
        isLoading,
        setIsOnTables,
        createTable,
        joinTableByLink,
        leaveTable,
        clearTableError,
        isOnTable
    } = useTable();

    return (
        <TableContext.Provider value={{
            isOnTables,
            currentTable,
            tableError,
            isLoading,
            setIsOnTables,
            createTableRequest: createTable,
            joinTableByLinkRequest: joinTableByLink,
            leaveTableRequest: leaveTable,
            clearTableError,
            isOnTable
        }}>
            {children}
        </TableContext.Provider>
    );
};

export default TableProvider;
