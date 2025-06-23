import React, { PropsWithChildren } from 'react';
import AuthContext from './authContext';
import useAuth from '../../hooks/useAuth';

const AuthProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { isLoggedIn, login, logout, register, loadUser, authError, clearAuthError } = useAuth();

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register, loadUser, authError, clearAuthError }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
