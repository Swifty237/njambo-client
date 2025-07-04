import React, { PropsWithChildren } from 'react';
import TableContext from './tableContext';
import useTable from '../../hooks/useTable';

const TableProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const {
        isOnTable,
        currentTable,
        tableError,
        isLoading,
        createTable,
        joinTableByLink,
        leaveTable,
        clearTableError
    } = useTable();

    return (
        <TableContext.Provider value={{
            isOnTable,
            currentTable,
            tableError,
            isLoading,
            createTableRequest: createTable,
            joinTableByLinkRequest: joinTableByLink,
            leaveTableRequest: leaveTable,
            clearTableError
        }}>
            {children}
        </TableContext.Provider>
    );
};

export default TableProvider;
