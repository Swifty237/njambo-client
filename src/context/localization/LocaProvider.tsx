import React, { useState, useEffect } from 'react';
import LocaContext from './locaContext';
// import { withRouter } from 'react-router-dom'; => Voir si le programme fonctionne sans ça

const initialState = localStorage.getItem('lang') || 'en';

interface LocaProviderProps {
  location: { search: string };
  children: React.ReactNode;
}

const LocaProvider: React.FC<LocaProviderProps> = ({ location, children }) => {
  const [lang, setLang] = useState(initialState);

  useEffect(() => {
    const lang = new URLSearchParams(location.search).get('lang');

    lang && setLang(lang);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('lang', lang);
    // eslint-disable-next-line
  }, [lang]);

  return (
    <LocaContext.Provider value={{ lang, setLang }}>
      {children}
    </LocaContext.Provider>
  );
};

export default LocaProvider;
