import React, { useContext } from 'react';
import LogoWithText from '../logo/LogoWithText';
import Logo from '../logo/LogoIcon';
import Container from '../layout/Container';
import styled from 'styled-components';
// import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Hider from '../layout/Hider';
import Button from '../buttons/Button';
import ChipsAmount from '../user/ChipsAmount';
import RealChipsAmount from '../user/RealChipsAmount';
import HamburgerButton from '../buttons/HamburgerButton';
import Spacer from '../layout/Spacer';
import Text from '../typography/Text';
import contentContext from '../../context/content/contentContext';
import Markdown from 'react-remarkable';

interface StyledNavProps {
  theme: { colors: { lightestBg: string } }
}

interface NavbarProps {
  loggedIn: boolean;
  chipsAmount: number;
  location: { pathname: string };
  openModal: (
    content: () => React.ReactNode,
    heading: string,
    buttonText: string
  ) => void;
  openNavMenu: () => void;
  className?: string;
}

const StyledNav = styled.nav`
  padding: 1rem 0;
  position: fixed;
  z-index: 99;
  width: 100%;
  background-color: ${(props: StyledNavProps) => props.theme.colors.lightestBg};
`;



const Navbar: React.FC<NavbarProps> = ({
  loggedIn,
  chipsAmount,
  location,
  openModal,
  openNavMenu,
  className,
}) => {
  const { getLocalizedString } = useContext(contentContext);

  const openShopModal = () =>
    openModal(
      () => (
        <Markdown>
          <Text textAlign="center">
            {getLocalizedString('shop-coming_soon-modal_text')}
          </Text>
        </Markdown>
      ),
      getLocalizedString('shop-coming_soon-modal_heading'),
      getLocalizedString('shop-coming_soon-modal_btn_text'),
    );

  if (!loggedIn)
    return (
      <StyledNav className={className}>
        <Container contentCenteredMobile>
          {/* <div
            style={{
              backgroundImage: "url('/img/Flag_of_Cameroon.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              opacity: 0.05,
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              width: "75vw",
              height: "38vw",
              top: "2.8vw",
              borderRadius: "10px",
              zIndex: -1
            }}
          /> */}
          <Link to="/">
            <LogoWithText />
          </Link>

          <Hider hideOnMobile>
            <Spacer>
              {location.pathname !== '/register' && (
                <Button as={Link} to="/register" primary small>
                  {getLocalizedString('navbar-register_btn')}
                </Button>
              )}
              {location.pathname !== '/login' && (
                <Button as={Link} to="/login" secondary small>
                  {getLocalizedString('navbar-login_btn')}
                </Button>
              )}
            </Spacer>
          </Hider>
        </Container>
      </StyledNav>
    );
  else
    return (
      <StyledNav className={className}>
        <Container>
          <Link to="/">
            <Hider hideOnMobile>
              <LogoWithText />
            </Hider>
            <Hider hideOnDesktop>
              <Logo />
            </Hider>
          </Link>
          <Spacer>
            <div>
              <ChipsAmount
                chipsAmount={chipsAmount}
                clickHandler={openShopModal}
              />
              <span style={{
                marginLeft: '3px',
                color: 'hsl(162, 100%, 28%)'
              }}>
                Argent fictif
              </span>
            </div>

            <div>
              <RealChipsAmount
                chipsAmount={chipsAmount}
                clickHandler={openShopModal}
              />
              <span style={{
                marginLeft: '3px',
                color: 'hsl(0, 100%, 46%)'
              }}>
                Argent réel
              </span>
            </div>


            {/* <Hider hideOnMobile>
              <Button to="/" primary small onClick={openShopModal}>
                {getLocalizedString('navbar-buychips_btn')}
              </Button>
            </Hider> */}
            <HamburgerButton clickHandler={openNavMenu} />
          </Spacer>
        </Container>
      </StyledNav>
    );
};

export default Navbar;
