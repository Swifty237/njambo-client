import React, { useState } from 'react';
import GlobalContext from './globalContext';
import { Player, Table } from '../../types/SeatTypesProps';
import syncUserData from '../../helpers/syncUserData';

const GlobalState: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(() => localStorage.getItem('userId') || '');
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || '');
  const [email, setEmail] = useState('');
  const [chipsAmount, setChipsAmount] = useState(() => Number(localStorage.getItem('chipsAmount')) || 0);
  const [tables, setTables] = useState<Table[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoading,
        userName,
        setUserName: (value: React.SetStateAction<string>) => {
          const newUserName = typeof value === 'function' ? value(userName) : value;
          setUserName(newUserName);
          syncUserData({ userName: newUserName });
        },
        email,
        setEmail,
        chipsAmount,
        setChipsAmount: (value: React.SetStateAction<number>) => {
          const newChipsAmount = typeof value === 'function' ? value(chipsAmount) : value;
          setChipsAmount(newChipsAmount);
          syncUserData({ chipsAmount: newChipsAmount });
        },
        id,
        setId: (value: React.SetStateAction<string>) => {
          const newId = typeof value === 'function' ? value(id) : value;
          setId(newId);
          syncUserData({ userId: newId });
        },
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
