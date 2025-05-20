import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import authContext from '../../context/auth/authContext';
import { RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { isLoggedIn } = useContext(authContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        !isLoggedIn ? <Redirect to="/" /> : <Component {...props} {...rest} />
      }
    />
  );
};

export default ProtectedRoute;
