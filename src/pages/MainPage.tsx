import React, { useContext, useEffect } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/typography/Heading';
import ColoredText from '../components/typography/ColoredText';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';
import globalContext from '../context/global/globalContext';
import contentContext from '../context/content/contentContext';
// import modalContext from '../context/modal/modalContext';
import Button from '../components/buttons/Button';
import { ThemeProps } from '../styles/theme';
import '../assets/css/switch_theme.css';
import gameContext, { TatamiProps } from '../context/game/gameContext';
import TatimiModalContent from '../components/game/TatimiModalContent';
import modalContext from '../context/modal/modalContext';

interface MainMenuCardProps {
  theme: ThemeProps;
}

const WelcomeHeading = styled(Heading)`
  @media screen and (min-width: 468px) and (min-height: 600px) {
    margin: 2rem auto;
  }

  @media screen and (max-width: 900px) and (max-height: 450px) and (orientation: landscape) {
    display: none;
  }
`;

const ResponsiveFlexDiv = styled.div`
  display: flex;
  margin: 1rem 2rem 0 1rem;

  @media (max-width: 640px) {
    display: block;
  }
`;

const MainMenuWrapper = styled.div`
  width: 40vw;
  height: 57vh;
  background-color: ${(props: MainMenuCardProps) => props.theme.colors.lightBg};
  border-radius: 1.5em;

  @media screen and (max-width: 1900px) {
    width: 60vw;
  }

  @media screen and (max-width: 1300px) {
    width: 70vw;
  }

  @media screen and (max-width: 800px) {
    width: 90vw;
  }
`;

const PartiesListWrapper = styled.div`
  width: 38vw;
  height: 37vh;
  background-color: white;
  justify-self: center;
  margin-top: 1em;
  overflow-y: auto;

   ul {
    padding: 2em 5em;
    margin: 0;
  }

  @media screen and (max-width: 1900px) {
    width: 58vw;
  }

  @media screen and (max-width: 1300px) {
    width: 68vw;
  }

  @media screen and (max-width: 800px) {
    width: 88vw;
    max-height: 35vh;
  }
`

const MainPage: React.FC = () => {
  const { userName, tables } = useContext(globalContext);
  const { getLocalizedString } = useContext(contentContext);
  const { openModal, closeModal } = useContext(modalContext);
  const { tatamiDataList, setTatamiDataList, joinTable } = useContext(gameContext);

  useEffect(() => {
    if (tables.length > 0) {
      setTatamiDataList(prevList => {
        const updatedList = [...prevList];

        tables.forEach(table => {
          // Only create new tatamiData if table doesn't have a link
          const tatamiData: TatamiProps = table.link ? {
            ...table,
            bet: (table.bet || '0').toString(),
            isPrivate: table.isPrivate || false,
            createdAt: table.createdAt || new Date().toLocaleString()
          } : {
            ...table,
            bet: (table.bet || '0').toString(),
            isPrivate: table.isPrivate || false,
            createdAt: table.createdAt || new Date().toLocaleString(),
            link: btoa(JSON.stringify({
              id: table.id,
              name: table.name,
              bet: (table.bet || '0').toString(),
              isPrivate: table.isPrivate || false
            }))
          };

          // Chercher l'index de la table existante
          const existingIndex = updatedList.findIndex(tatami => tatami.id === table.id);

          if (existingIndex !== -1) {
            // Si la table existe, la remplacer
            updatedList[existingIndex] = tatamiData;
          } else {
            // Si la table n'existe pas, l'ajouter
            updatedList.push(tatamiData);
          }
        });

        return updatedList;
      });
    } else {
      setTatamiDataList([]);
    }
  }, [tables]);

  useScrollToTopOnPageLoad();


  const openCreateTatimiModal = () => {

    openModal(
      () => <TatimiModalContent onCreateTamtami={joinTable} />,
      'Nouveau Tatami',
      'Annuler',
      () => closeModal()
    );
  };

  return (
    <Container
      fullHeight
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      padding="6rem 2rem 2rem 2rem"
    >
      <WelcomeHeading as="h2" textCentered>
        {getLocalizedString('main_page-salutation')}{' '}
        <ColoredText>{userName}!</ColoredText>
      </WelcomeHeading>

      <MainMenuWrapper>
        <ResponsiveFlexDiv>

          <h5 style={{
            margin: ".5em .5em .5em 0",
            textAlign: "center"
          }}>
            Argent fictif
          </h5>

          <Button onClick={openCreateTatimiModal}
            $large
            $primary
            $fullWidth
          >
            <div style={{ marginRight: ".5em" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-suit-club" viewBox="0 0 16 16">
                <path d="M8 1a3.25 3.25 0 0 0-3.25 3.25c0 .186 0 .29.016.41.014.12.045.27.12.527l.19.665-.692-.028a3.25 3.25 0 1 0 2.357 5.334.5.5 0 0 1 .844.518l-.003.005-.006.015-.024.055a22 22 0 0 1-.438.92 22 22 0 0 1-1.266 2.197c-.013.018-.02.05.001.09q.016.029.03.036A.04.04 0 0 0 5.9 15h4.2q.014 0 .022-.006a.1.1 0 0 0 .029-.035c.02-.04.014-.073.001-.091a23 23 0 0 1-1.704-3.117l-.024-.054-.006-.015-.002-.004a.5.5 0 0 1 .838-.524c.601.7 1.516 1.168 2.496 1.168a3.25 3.25 0 1 0-.139-6.498l-.699.03.199-.671c.14-.47.14-.745.139-.927V4.25A3.25 3.25 0 0 0 8 1m2.207 12.024c.225.405.487.848.78 1.294C11.437 15 10.975 16 10.1 16H5.9c-.876 0-1.338-1-.887-1.683.291-.442.552-.88.776-1.283a4.25 4.25 0 1 1-2.007-8.187l-.009-.064c-.023-.187-.023-.348-.023-.52V4.25a4.25 4.25 0 0 1 8.5 0c0 .14 0 .333-.04.596a4.25 4.25 0 0 1-.46 8.476 4.2 4.2 0 0 1-1.543-.298" />
              </svg>
            </div>
            {`Nouveau tatami`}
          </Button>

        </ResponsiveFlexDiv>

        <PartiesListWrapper>
          <ul>
            {tatamiDataList.length === 0 ? (
              <li style={{
                textAlign: 'center',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Aucun tatami créé. Cliquez sur "Nouveau tatami" pour commencer.
              </li>
            ) : (
              tatamiDataList.map((tatamiData) => (
                <li key={tatamiData.id}>
                  <Link
                    to={{
                      pathname: `/play/${tatamiData.link}`,
                      state: {
                        tatamiData: {
                          id: tatamiData.id,
                          name: tatamiData.name,
                          bet: tatamiData.bet,
                          isPrivate: tatamiData.isPrivate,
                          createdAt: tatamiData.createdAt,
                          link: tatamiData.link
                        }
                      }
                    }}
                    onClick={() => {
                      const storedLink = localStorage.getItem('storedLink');
                      // Si le lien stocké est différent du nouveau lien, on met à jour
                      if (!storedLink || storedLink !== tatamiData.link) {
                        localStorage.setItem('storedLink', tatamiData.link);
                      }
                      joinTable(tatamiData);
                    }}
                  >
                    <span style={{ textDecoration: 'underline' }}>
                      <strong>{tatamiData.name}</strong> - Tarif / coup : {tatamiData.bet} F CFA - Accès : {tatamiData.isPrivate ? 'privé' : 'ouvert'}
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>

        </PartiesListWrapper>
      </MainMenuWrapper>
    </Container >
  );
};

export default MainPage;
