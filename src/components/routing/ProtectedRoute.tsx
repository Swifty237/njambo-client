import React, { useContext, useEffect } from 'react';
import { Route, useHistory } from 'react-router-dom';
import authContext from '../../context/auth/authContext';
import { RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isLoggedIn, } = useContext(authContext);
  const history = useHistory();

  useEffect(() => {
    if (!isLoggedIn) {
      history.push('/');
    }
  }, [isLoggedIn, history]);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (isLoggedIn) {
          return <Component {...props} {...rest} />;
        }
        return null;
      }}
    />
  );
};

export default ProtectedRoute;
