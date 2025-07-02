import React, { useContext, useCallback } from 'react';
import addChips from '../../helpers/addChips';
import LogoWithText from '../logo/LogoWithText';
import globalContext from '../../context/global/globalContext';
import modalContext from '../../context/modal/modalContext';
import authContext from '../../context/auth/authContext';
import Container from '../layout/Container';
import styled from 'styled-components';
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
import { FormGroup } from '../forms/FormGroup';
import { Input } from '../forms/Input';
import { ButtonGroup } from '../forms/ButtonGroup';

interface StyledNavProps {
  theme: { colors: { lightestBg: string } }
}

interface NavbarProps {
  loggedIn: boolean;
  chipsAmount: number;
  location: { pathname: string };
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
  openNavMenu,
  className,
}) => {
  const { getLocalizedString } = useContext(contentContext);
  const { id: userId } = useContext(globalContext);
  const { openModal: openModalFromContext, closeModal: closeModalFromContext } = useContext(modalContext);
  const { loadUser } = useContext(authContext);
  const minBuyIn = 1000;
  const maxBuyIn = 30000 - chipsAmount;

  const handleAddChips = useCallback(async (amount: number) => {
    try {
      await addChips(userId, amount);
    } catch (error) {
      // Handle error silently
    }
  }, [userId]);

  const openShopModal = () =>
    openModalFromContext(
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

  const submitAddChipsForm = () => {
    const addChipsInput = document.getElementById('chipsInput') as HTMLInputElement | null;
    const chipsAmountToAdd = addChipsInput ? + addChipsInput.value : 0;

    if (
      chipsAmountToAdd && chipsAmountToAdd <= maxBuyIn
    ) {
      handleAddChips(chipsAmountToAdd)
        .then(() => {
          // Recharger les données utilisateur pour mettre à jour l'interface
          loadUser(localStorage.token);
          closeModalFromContext();
        })
        .catch(() => {
          closeModalFromContext(); // Fermer la modal même en cas d'erreur
        });
    }
  };

  const openAddChipsModal = () => {
    // Calculer le minBuyIn effectif pour l'affichage
    const effectiveMinBuyIn = maxBuyIn < 1000 ? maxBuyIn : minBuyIn;

    openModalFromContext(() => (
      <div>
        <Markdown>
          <Text textAlign="center">
            {'Tu as raison de take plus de jetons,'}
            <br />
            {'30 000 jetons maximun total'}
          </Text>
        </Markdown>

        <div>
          <FormGroup>
            <Input
              id="chipsInput"
              type="number"
              min={effectiveMinBuyIn}
              max={maxBuyIn}
              defaultValue={effectiveMinBuyIn}
            />
          </FormGroup>
          <ButtonGroup>
            <Button
              $primary
              type="button"
              $fullWidth
              onClick={() => {
                const input = document.getElementById('chipsInput') as HTMLInputElement;
                if (input) input.value = maxBuyIn.toString();
              }}
            >
              {'Max'}
            </Button>

            <Button
              $primary
              type="button"
              $fullWidth
              onClick={() => {
                const input = document.getElementById('chipsInput') as HTMLInputElement;
                if (input) input.value = effectiveMinBuyIn.toString();
              }}
            >
              {'Min'}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    ),
      'Ajouter des jetons',
      'Valider',
      submitAddChipsForm
    );
  };

  if (!loggedIn)
    return (
      <StyledNav className={className}>
        <Container contentCenteredMobile>
          <Link to="/">
            <LogoWithText />
          </Link>

          <Hider hideOnMobile>
            <Spacer>
              {location.pathname !== '/register' && (
                <Button as={Link} to="/register" $primary $small>
                  {getLocalizedString('navbar-register_btn')}
                </Button>
              )}
              {location.pathname !== '/login' && (
                <Button as={Link} to="/login" $secondary $small>
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
            <LogoWithText />
          </Link>

          <Spacer
            style={{
              width: "50%",
            }}
          >

            <Hider hideOnMobile>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'end',
                }}
              >
                <ChipsAmount
                  tooltip="Clique ici pour ajouter des jetons fictifs"
                  chipsAmount={chipsAmount}
                  clickHandler={openAddChipsModal}
                />

                <span style={{
                  marginLeft: '',
                  color: 'hsl(162, 100%, 28%)'
                }}>
                  Argent fictif
                </span>
              </div>
            </Hider>

            <Hider hideOnMobile>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'end',
                }}
              >
                <RealChipsAmount
                  tooltip="Clique ici pour ajouter des jetons réels"
                  chipsAmount={chipsAmount}
                  clickHandler={openShopModal}
                />

                <span style={{
                  marginLeft: '',
                  color: 'hsl(0, 100%, 46%)'
                }}>
                  Argent réel
                </span>
              </div>

            </Hider>

            <HamburgerButton clickHandler={openNavMenu} />
          </Spacer>
        </Container>
      </StyledNav>
    );
};

export default Navbar;
