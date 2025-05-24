import React, { useContext } from 'react';
import Container from '../components/layout/Container';
import Heading from '../components/typography/Heading';
import ColoredText from '../components/typography/ColoredText';
import styled from 'styled-components';
// import Text from '../components/typography/Text';
import { Link, withRouter } from 'react-router-dom';
import useScrollToTopOnPageLoad from '../hooks/useScrollToTopOnPageLoad';
import globalContext from '../context/global/globalContext';
import contentContext from '../context/content/contentContext';
// import modalContext from '../context/modal/modalContext';
import { RouteComponentProps } from 'react-router-dom';
import Button from '../components/buttons/Button';

interface MainMenuCardProps {
  theme: {
    colors: {
      primaryCta: string;
      playingCardBg: string;
      lightBg: string;
    };
    other: {
      stdBorderRadius: string;
      cardDropShadow: string;
    };
  }
}

const WelcomeHeading = styled(Heading)`
  @media screen and (min-width: 468px) and (min-height: 600px) {
    margin: 2rem auto;
  }

  @media screen and (max-width: 900px) and (max-height: 450px) and (orientation: landscape) {
    display: none;
  }
`;

// const MainMenuWrapper = styled.div`
//   margin: 0 0 auto 0;
//   display: grid;
//   justify-content: center;
//   align-content: center;
//   grid-template-columns: repeat(2, minmax(250px, auto));
//   grid-template-rows: repeat(2, minmax(250px, auto));
//   grid-gap: 2rem;
//   max-width: 600px;

//   @media screen and (max-width: 900px) and (max-height: 450px) and (orientation: landscape) {
//     grid-template-columns: repeat(4, 140px);
//     grid-template-rows: repeat(1, minmax(140px, auto));
//     grid-gap: 1rem;
//   }

//   @media screen and (max-width: 590px) and (max-height: 420px) and (orientation: landscape) {
//     grid-template-columns: repeat(4, 120px);
//     grid-template-rows: repeat(1, minmax(120px, auto));
//     grid-gap: 1rem;
//   }

//   @media screen and (max-width: 468px) {
//     grid-template-columns: repeat(1, auto);
//     grid-template-rows: repeat(4, auto);
//     grid-gap: 1rem;
//   }
// `;

const MainMenuWrapper = styled.div`
  width: 90vw;
  height: 90vh;
  background-color: ${(props: MainMenuCardProps) => props.theme.colors.lightBg};
  border-radius: 1.5em;
`;

// const MainMenuCard = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   text-align: center;
//   cursor: pointer;
//   background-color: ${(props: MainMenuCardProps) => props.theme.colors.playingCardBg};
//   border-radius: ${(props: MainMenuCardProps) => props.theme.other.stdBorderRadius};
//   padding: 1.5rem 2rem;
//   box-shadow: ${(props: MainMenuCardProps) => props.theme.other.cardDropShadow};

//   &,
//   & > * {
//     user-select: none;
//     -moz-user-select: none;
//     -khtml-user-select: none;
//     -webkit-user-select: none;
//     -o-user-select: none;
//   }

//   ${Heading} {
//     margin-bottom: 0;
//     color: ${(props: MainMenuCardProps) => props.theme.colors.primaryCta};
//     word-wrap: break-word;
//   }

//   img {
//     margin: 1rem;
//     width: 75%;
//     max-width: 170px;
//   }

//   @media screen and (min-width: 648px) {
//     font-size: 3rem;
//   }

//   @media screen and (max-width: 648px) {
//     padding: 0.5rem;
//   }

//   @media screen and (max-width: 468px) {
//     flex-direction: row;
//     justify-content: space-between;
//     border-radius: 90px 40px 40px 90px;
//     padding: 0 1rem 0 0;

//     ${Heading} {
//       text-align: right;
//       margin: 0 1rem;
//     }

//     img {
//       max-width: 80px;
//       margin: 0;
//     }
//   }
// `;

const MainPage: React.FC<RouteComponentProps> = ({ history }) => {
  const { userName } = useContext(globalContext);
  const { getLocalizedString } = useContext(contentContext);
  // const { openModal } = useContext(modalContext);

  useScrollToTopOnPageLoad();

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

        <div style={{
          display: "flex",
          margin: "1rem",
        }}>
          <Button as={Link} to="" large primary fullWidth >

            <div style={{ marginRight: ".5em" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-suit-club" viewBox="0 0 16 16">
                <path d="M8 1a3.25 3.25 0 0 0-3.25 3.25c0 .186 0 .29.016.41.014.12.045.27.12.527l.19.665-.692-.028a3.25 3.25 0 1 0 2.357 5.334.5.5 0 0 1 .844.518l-.003.005-.006.015-.024.055a22 22 0 0 1-.438.92 22 22 0 0 1-1.266 2.197c-.013.018-.02.05.001.09q.016.029.03.036A.04.04 0 0 0 5.9 15h4.2q.014 0 .022-.006a.1.1 0 0 0 .029-.035c.02-.04.014-.073.001-.091a23 23 0 0 1-1.704-3.117l-.024-.054-.006-.015-.002-.004a.5.5 0 0 1 .838-.524c.601.7 1.516 1.168 2.496 1.168a3.25 3.25 0 1 0-.139-6.498l-.699.03.199-.671c.14-.47.14-.745.139-.927V4.25A3.25 3.25 0 0 0 8 1m2.207 12.024c.225.405.487.848.78 1.294C11.437 15 10.975 16 10.1 16H5.9c-.876 0-1.338-1-.887-1.683.291-.442.552-.88.776-1.283a4.25 4.25 0 1 1-2.007-8.187l-.009-.064c-.023-.187-.023-.348-.023-.52V4.25a4.25 4.25 0 0 1 8.5 0c0 .14 0 .333-.04.596a4.25 4.25 0 0 1-.46 8.476 4.2 4.2 0 0 1-1.543-.298" />
              </svg>
            </div>

            {`Nouvelle Partie`}
          </Button>

          <h5 style={{
            marginLeft: "1em"
          }}>
            Argent fictif
          </h5>
        </div>

        <div style={{
          width: "80vw",
          height: "65vh",
          backgroundColor: "white",
          justifySelf: "center"
        }}>

          <ul style={{
            padding: "2em 5em"
          }}>
            <li>
              <p> Tatami-1 : 3 joueurs - coup 50 FCFA - ouvert</p>
            </li>

            <li>
              <p> Tatami-2 : 3 joueurs - coup 50 FCFA - ouvert</p>
            </li>

            <li>
              <p> Tatami-3 : 3 joueurs - coup 50 FCFA - ouvert</p>
            </li>

            <li>
              <p> Tatami-4 : 3 joueurs - coup 50 FCFA - ouvert</p>
            </li>

            <li>
              <p> Tatami-5 : 3 joueurs - coup 50 FCFA - ouvert</p>
            </li>
          </ul>

        </div>

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