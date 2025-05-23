import React, { useContext } from 'react';
import Landing from './Landing';
import MainPage from './MainPage';
import authContext from '../context/auth/authContext';

const HomePage = () => {
  const { isLoggedIn } = useContext(authContext);

  if (!isLoggedIn) return (
    <div>
      <div
        style={{
          backgroundImage: "url('/img/Flag_of_Cameroon.png')",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          opacity: 0.08,
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          width: "77%",
          height: "77%",
          display: "flex",
          justifySelf: "center",
          alignSelf: "center",
          borderRadius: "2vw"
        }}
      />
      <Landing />
    </div>
  );
  else return <MainPage />;
};

export default HomePage;