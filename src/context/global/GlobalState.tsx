import React, { useState } from 'react';
import GlobalContext from './globalContext';
import { Player, Table } from '../../types/SeatTypesProps';

const GlobalState: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [chipsAmount, setChipsAmount] = useState(0);
  const [tables, setTables] = useState<Table[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        userName,
        setUserName,
        email,
        setEmail,
        chipsAmount,
        setChipsAmount,
        id,
        setId,
        tables,
        setTables,
        players,
        setPlayers,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalState;
