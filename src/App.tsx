import React, { useContext } from 'react';
import MainLayout from './layouts/_MainLayout';
import LoadingScreen from './components/loading/LoadingScreen';
import globalContext from './context/global/globalContext';
import Routes from './components/routing/Routes';
import contentContext from './context/content/contentContext';
import config from './clientConfig';
import GoogleAnalytics from './components/analytics/GoogleAnalytics';
import { useLocation } from 'react-router-dom';

const App = () => {
  const { isLoading } = useContext(globalContext);
  const { isLoading: contentIsLoading } = useContext(contentContext);
  // const { closeModal } = useContext(modalContext);

  const location = useLocation();

  // function showFreeChipsModal() {
  //   openModal(
  //     () => (
  //       <Text textAlign="center">
  //         {getLocalizedString('global_get-free-chips-modal_content')}
  //       </Text>
  //     ),
  //     getLocalizedString('global_get-free-chips-modal_header'),
  //     getLocalizedString('global_get-free-chips-modal_btn-txt'),
  //     handleFreeChipsRequest,
  //   );
  // }

  // const handleFreeChipsRequest = async () => {
  //   setIsLoading(true);

  //   try {
  //     const token = localStorage.token;

  //     const res = await Axios.get('/api/chips/free', {
  //       headers: {
  //         'x-auth-token': token,
  //       },
  //     });

  //     const { chipsAmount } = res.data;

  //     setChipsAmount(chipsAmount);
  //   } catch (error) {
  //     alert(error);
  //   } finally {
  //     closeModal();
  //   }

  //   setIsLoading(false);
  // };

  // useEffect(() => {
  //   chipsAmount !== null &&
  //     chipsAmount < 1000 &&
  //     !isLoading &&
  //     !contentIsLoading
  //     && setTimeout(showFreeChipsModal, 2000);

  //   // eslint-disable-next-line
  // }, [chipsAmount, isLoading, contentIsLoading]);



  return (
    <>
      {isLoading || contentIsLoading ? (
        <LoadingScreen />
      ) : (
        <MainLayout location={location}>
          <Routes />
        </MainLayout>
      )}
      {config.isProduction && <GoogleAnalytics />}
    </>
  );
};

export default App;
