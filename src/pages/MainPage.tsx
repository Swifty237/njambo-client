import React, { useContext, useEffect, useRef, useState } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/typography/Heading';
import ColoredText from '../components/typography/ColoredText';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';
import globalContext from '../context/global/globalContext';
import contentContext from '../context/content/contentContext';
import modalContext from '../context/modal/modalContext';
import { RouteComponentProps } from 'react-router-dom';
import Button from '../components/buttons/Button';
import { ThemeProps } from '../styles/theme';
import { Form } from '../components/forms/Form';
import { FormGroup } from '../components/forms/FormGroup';
import { Label } from '../components/forms/Label';
import { Select } from '../components/forms/Select';
import '../assets/css/switch_theme.css';
import { Input } from '../components/forms/Input';

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
  const { userName } = useContext(globalContext);
  const { getLocalizedString } = useContext(contentContext);
  const { openModal, closeModal } = useContext(modalContext);
  const [price, setPrice] = useState<string>('25');
  const [isPrivate, setIsPrivate] = useState<boolean>(false)
  const [tatamiLinks, setTatamiLinks] = useState<any[]>([])

  useScrollToTopOnPageLoad();

  // Fonction pour générer un ID unique pour le tatami
  const generateTatamiId = () => {
    return Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  // Fonction pour créer un lien tatami
  const createTatamiLink = (price: string, isPrivate: boolean) => {
    const tatamiId = generateTatamiId();
    const tatamiName = `tatami-${tatamiId}`;
    const link = `/play/${tatamiName}?price=${price}&private=${isPrivate}`;

    return {
      id: tatamiId,
      name: tatamiName,
      price: price,
      isPrivate: isPrivate,
      link: link,
      createdAt: new Date().toLocaleString()
    };
  };

  const tatamiSpecFormModal = () =>
    openModal(() => (
      <Form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          // Créer le nouveau lien tatami
          const newTatamiLink = createTatamiLink(price, isPrivate);

          // Ajouter le lien au tableau tatamiLinks
          setTatamiLinks(prevLinks => [...prevLinks, newTatamiLink]);

          // Rediriger vers la page de jeu avec le nouveau lien
          // history.push(newTatamiLink.link);
          closeModal();
        }}>

        <FormGroup>
          <Label>{'Tarif / coup'}</Label>
          <Select
            id="select-price"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPrice(e.target.value)}
          >
            <option value="25">25 F CFA</option>
            <option value="50">50 F CFA</option>
            <option value="100">100 F CFA</option>
            <option value="200">200 F CFA</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              margin: '5px 0 10px 0',
            }}>
            <Label>{'Tatami privé ?'}</Label>

            <label className="switch">
              <input type="checkbox" onChange={() => { setIsPrivate(!isPrivate) }} />
              <span className="slider"></span>
            </label>
          </div>
        </FormGroup>

        <Button $primary type="submit" $fullWidth>
          {'Créer'}
        </Button>
      </Form>
    ),
      'Tatami-01',
      'Annuler',
    );


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

          {/* <Button onClick={() => history.push('/play')} $large $primary $fullWidth>
            <div style={{ marginRight: ".5em" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-suit-club" viewBox="0 0 16 16">
                <path d="M8 1a3.25 3.25 0 0 0-3.25 3.25c0 .186 0 .29.016.41.014.12.045.27.12.527l.19.665-.692-.028a3.25 3.25 0 1 0 2.357 5.334.5.5 0 0 1 .844.518l-.003.005-.006.015-.024.055a22 22 0 0 1-.438.92 22 22 0 0 1-1.266 2.197c-.013.018-.02.05.001.09q.016.029.03.036A.04.04 0 0 0 5.9 15h4.2q.014 0 .022-.006a.1.1 0 0 0 .029-.035c.02-.04.014-.073.001-.091a23 23 0 0 1-1.704-3.117l-.024-.054-.006-.015-.002-.004a.5.5 0 0 1 .838-.524c.601.7 1.516 1.168 2.496 1.168a3.25 3.25 0 1 0-.139-6.498l-.699.03.199-.671c.14-.47.14-.745.139-.927V4.25A3.25 3.25 0 0 0 8 1m2.207 12.024c.225.405.487.848.78 1.294C11.437 15 10.975 16 10.1 16H5.9c-.876 0-1.338-1-.887-1.683.291-.442.552-.88.776-1.283a4.25 4.25 0 1 1-2.007-8.187l-.009-.064c-.023-.187-.023-.348-.023-.52V4.25a4.25 4.25 0 0 1 8.5 0c0 .14 0 .333-.04.596a4.25 4.25 0 0 1-.46 8.476 4.2 4.2 0 0 1-1.543-.298" />
              </svg>
            </div>
            {`Nouvelle partie`}
          </Button> */}

          <Button onClick={() => tatamiSpecFormModal()}
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
            {tatamiLinks.length === 0 ? (
              <li style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#666',
                fontStyle: 'italic'
              }}>
                Aucun tatami créé. Cliquez sur "Nouveau tatami" pour commencer.
              </li>
            ) : (
              tatamiLinks.map((tatami) => (
                <li
                  key={tatami.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    margin: '0.5rem 0',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>{tatami.name}</h4>
                    <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
                      Prix: {tatami.price} F CFA | {tatami.isPrivate ? 'Privé' : 'Public'}
                    </p>
                  </div>
                  <Button
                    onClick={() => history.push(tatami.link)}
                    $primary
                  >
                    Rejoindre
                  </Button>
                </li>
              ))
            )}
          </ul>
        </PartiesListWrapper>

        {/* <MainMenuCard onClick={() => history.push('/play')}>
          <img src={String(kingImg)} alt="Join Table" />
          <Heading as="h3" headingClass="h5" textCentered>
            {getLocalizedString('main_page-join_table').toUpperCase()}
          </Heading>
        </MainMenuCard>

        <MainMenuCard onClick={() => history.push('/play')}>
          <img src={String(queen2Img)} alt="Quick Game" />
          <Heading as="h3" headingClass="h5" textCentered>
            {getLocalizedString('main_page-quick_game').toUpperCase()}
          </Heading>
        </MainMenuCard>

        <MainMenuCard
          onClick={() => {
            openModal(
              () => (
                <Text textAlign="center">
                  {getLocalizedString('main_page-modal_text')}
                </Text>
              ),
              getLocalizedString('main_page-modal_heading'),
              getLocalizedString('main_page-modal_button_text'),
            );
          }}
        >
          <img src={String(jackImg)} alt="Shop" />
          <Heading as="h3" headingClass="h5" textCentered>
            {getLocalizedString('main_page-open_shop').toUpperCase()}
          </Heading>
        </MainMenuCard>

        <MainMenuCard onClick={() => history.push('/game-rules')}>
          <img src={String(queenImg)} alt="Rules" />
          <Heading as="h3" headingClass="h5" textCentered>
            {getLocalizedString('main_page-open_rules').toUpperCase()}
          </Heading>
        </MainMenuCard> */}

      </MainMenuWrapper>
    </Container >
  );
};

export default withRouter(MainPage);