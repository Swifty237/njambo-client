import { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import setAuthToken from '../helpers/setAuthToken';
import globalContext from '../context/global/globalContext';
import { useHistory } from 'react-router-dom';
// import tableContext from '../context/table/tableContext';

const useAuth = () => {
  localStorage.token && setAuthToken(localStorage.token);

  const SERVER_URI = process.env.REACT_APP_SERVER_URI;
  const history = useHistory();

  // const { setIsOnTable } = useContext(tableContext);

  const {
    setId,
    setIsLoading,
    setUserName,
    setEmail,
    setChipsAmount,
  } = useContext(globalContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);

    const token = localStorage.getItem("token");
    token && loadUser(token);
    setIsLoading(false);
    // eslint-disable-next-line
  }, []);

  const clearAuthError = () => {
    setAuthError(null);
  };

  const getErrorMessage = (error: any): string => {
    if (error.response) {
      // Erreur de réponse du serveur
      switch (error.response.status) {
        case 400:
          return 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.';
        case 401:
          return 'Email ou mot de passe incorrect.';
        case 404:
          return 'Utilisateur non trouvé.';
        case 500:
          return 'Erreur du serveur. Veuillez réessayer plus tard.';
        default:
          return 'Une erreur est survenue lors de la connexion.';
      }
    } else if (error.request) {
      // Erreur de réseau
      return 'Problème de connexion. Vérifiez votre connexion internet.';
    } else {
      // Autre erreur
      return 'Une erreur inattendue est survenue.';
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await Axios.post(`${SERVER_URI}/api/users`, {
        name,
        email,
        password,
      });

      const token = res.data.token;

      if (token) {
        localStorage.setItem('token', token);
        setAuthToken(token);
        await loadUser(token);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
    }
    setIsLoading(false);
  };

  const login = async (emailAddress: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const res = await Axios.post(`${SERVER_URI}/api/auth`, {
        email: emailAddress,
        password: password,
      });

      const token = res.data.token;

      if (token) {
        localStorage.setItem('token', token);
        setAuthToken(token);
        await loadUser(token);
        setIsLoading(false);
        return true;
      } else {
        setAuthError('Aucun token reçu du serveur.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      setIsLoading(false);
      return false;
    }
  };

  const loadUser = async (token: string) => {
    try {
      setAuthToken(token);

      const res = await Axios.get(`${SERVER_URI}/api/auth`, {
        headers: {
          'x-auth-token': token,
        },
      });

      const { _id, name, email, chipsAmount } = res.data;

      setIsLoggedIn(true);
      setId(_id);
      setUserName(name);
      setEmail(email);
      setChipsAmount(chipsAmount);
      setAuthError(null); // Clear any previous errors on successful load

      // Synchroniser avec localStorage
      localStorage.setItem('userId', _id);
      localStorage.setItem('userName', name);
      localStorage.setItem('chipsAmount', chipsAmount.toString());
      history.push(`/`);

    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('chipsAmount');
      localStorage.removeItem('isOnTables');
      localStorage.removeItem('storedLink');
      const errorMessage = getErrorMessage(error);
      setAuthError(errorMessage);
      setIsLoggedIn(false);
    }
  };

  const logout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('chipsAmount');
    localStorage.removeItem('isOnTables');
    localStorage.removeItem('storedLink');

    // Réinitialiser l'état
    setIsLoggedIn(false);
    setId('');
    setUserName('');
    setEmail('');
    setChipsAmount(0);
    setAuthError(null); // Clear errors on logout
  };

  return { isLoggedIn, login, logout, register, loadUser, authError, clearAuthError };
};

export default useAuth;