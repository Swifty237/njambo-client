import React, { useState } from 'react';
import GlobalContext from './globalContext';

const GlobalState: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [chipsAmount, setChipsAmount] = useState(0);
  const [tables, setTables] = useState('');
  const [players, setPlayers] = useState('');

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
