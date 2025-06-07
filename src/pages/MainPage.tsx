import React, { useContext, useEffect, useState } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/typography/Heading';
import ColoredText from '../components/typography/ColoredText';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';
import globalContext from '../context/global/globalContext';
import contentContext from '../context/content/contentContext';
// import modalContext from '../context/modal/modalContext';
import { RouteComponentProps } from 'react-router-dom';
import Button from '../components/buttons/Button';
import { ThemeProps } from '../styles/theme';
import { Form } from '../components/forms/Form';
import { FormGroup } from '../components/forms/FormGroup';
import { Label } from '../components/forms/Label';
import { Select } from '../components/forms/Select';
import '../assets/css/switch_theme.css';
import { v4 as uuidv4 } from 'uuid';
import gameContext, { TatamiProps } from '../context/game/gameContext';

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
  height: 75vh;
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
  height: 55vh;
  background-color: white;
  justify-self: center;
  margin-top: 1em;

   ul {
    padding: 2em 5em;
    height: 100%;
    overflow-y: auto;
  }

  @media screen and (max-width: 1900px) {
    width: 58vw;
  }

  @media screen and (max-width: 1300px) {
    width: 68vw;
  }

  @media screen and (max-width: 800px) {
    width: 88vw;
    height: 37vh;
  }
`

const MainPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { userName, tables } = useContext(globalContext);
  const { getLocalizedString } = useContext(contentContext);
  // const { openModal, closeModal } = useContext(modalContext);
  const { joinTable } = useContext(gameContext);
  const [bet, setBet] = useState<string>('25');
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [tatamiDataList, setTatamiDataList] = useState<TatamiProps[]>([])
  const [displayTatamiList, setDisplayTatamiList] = useState<Boolean>(true);
  // const { currentTable } = useContext(gameContext);

  useEffect(() => {
    if (tables.length > 0) {
      setTatamiDataList(prevList => {
        const updatedList = [...prevList];

        tables.forEach(table => {
          const tatamiData: TatamiProps = {
            id: table.id,
            name: table.name,
            bet: (table.bet || '0').toString(),
            isPrivate: table.isPrivate || false,
            createdAt: table.createdAt || new Date().toLocaleString()
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

  // Fonction pour générer un ID unique pour le tatami
  const generateTatamiId = () => {
    return Math.random().toString(36).slice(2, 6).toUpperCase();
  };

  // Fonction pour créer un lien tatami
  const createTatamiData = (bet: string, isPrivate: boolean) => {
    const id = uuidv4();
    const tatamiNameId = generateTatamiId();
    const tatamiName = `tatami-${tatamiNameId}`;

    return {
      id: id,
      name: tatamiName,
      bet: bet,
      isPrivate: isPrivate,
      createdAt: new Date().toLocaleString()
    };
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

          <Button onClick={() => displayTatamiList && setDisplayTatamiList(false)}
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
          {displayTatamiList ? (
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
                  <li key={tatamiData.id} onClick={() => joinTable(tatamiData)}>
                    <Link to={{
                      pathname: '/play',
                      state: {
                        id: tatamiData.id,
                        name: tatamiData.name,
                        bet: tatamiData.bet,
                        isPrivate: tatamiData.isPrivate
                      }
                    }}>
                      <span style={{ textDecoration: 'underline' }}>
                        <strong>{tatamiData.name}</strong> - Tarif / coup : {tatamiData.bet} F CFA - Accès : {tatamiData.isPrivate ? 'privé' : 'ouvert'}
                      </span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>

              <div style={{
                width: '70%',
                height: '60%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                alignItems: 'center',
                border: '2px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 0 10px rgba(0, 0, 0)',
              }}>
                <Form
                  onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();

                    // Créer le nouveau lien tatami
                    const newTatamiData = createTatamiData(bet, isPrivate);

                    setDisplayTatamiList(true);

                    // Rediriger vers la page de jeu avec le nouveau lien
                    history.push('/play', { tatamiData: newTatamiData });
                  }}>

                  <FormGroup>
                    <Label>{'Tarif / coup'}</Label>
                    <Select
                      id="select-price"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBet(e.target.value)}
                    >
                      <option value="25">25 F CFA</option>
                      <option value="50">50 F CFA</option>
                      <option value="100">100 F CFA</option>
                      <option value="200">200 F CFA</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>{'Tatami privé ?'}</Label>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        margin: '5px 0 10px 0',
                      }}>

                      <label className="switch">
                        <input type="checkbox" onChange={() => setIsPrivate(!isPrivate)} />
                        <span className="slider"></span>
                      </label>

                      <span>{isPrivate ? "Oui" : "Non"}</span>
                    </div>
                  </FormGroup>

                  <Button $primary type="submit" $fullWidth>
                    {'Créer'}
                  </Button>
                </Form>

                <Button $secondary onClick={() => setDisplayTatamiList(true)}>
                  {'Annuler'}
                </Button>
              </div>

            </div>
          )
          }


        </PartiesListWrapper>
      </MainMenuWrapper>
    </Container >
  );
};

export default withRouter(MainPage);