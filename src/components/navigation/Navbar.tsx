import React, { useContext, useCallback, useState } from 'react';
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
    console.log('handleAddChips appelé avec:', { userId, amount });
    try {
      await addChips(userId, amount);
      console.log('Ajout de jetons réussi');
    } catch (error) {
      console.error('Erreur lors de l\'ajout de jetons:', error);
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
    console.log('submitAddChipsForm appelé');

    const addChipsInput = document.getElementById('chipsInput') as HTMLInputElement | null;
    const chipsAmountToAdd = addChipsInput ? + addChipsInput.value : 0;

    if (
      chipsAmountToAdd && chipsAmountToAdd <= maxBuyIn
    ) {
      console.log('Validation réussie, appel de handleAddChips');
      handleAddChips(chipsAmountToAdd)
        .then(() => {
          console.log('handleAddChips terminé avec succès');
          // Recharger les données utilisateur pour mettre à jour l'interface
          loadUser(localStorage.token);
          closeModalFromContext();
        })
        .catch((error) => {
          console.error('Erreur dans handleAddChips:', error);
          closeModalFromContext(); // Fermer la modal même en cas d'erreur
        });
    } else {
      console.log('Validation échouée', {
        chipsAmountToAdd,
        maxBuyIn,
        condition2: chipsAmountToAdd <= maxBuyIn
      });
    }
  };

  const openAddChipsModal = () => {
    console.log('Ouverture du modal d\'ajout de jetons');
    console.log('Valeurs au moment de l\'ouverture:', { maxBuyIn, minBuyIn, chipsAmount });

    // Calculer le minBuyIn effectif pour l'affichage
    const effectiveMinBuyIn = maxBuyIn < 1000 ? maxBuyIn : minBuyIn;

    console.log('effectiveMinBuyIn pour le modal:', effectiveMinBuyIn);

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

          <Spacer>

            <Hider hideOnMobile>
              <ChipsAmount
                chipsAmount={chipsAmount}
                clickHandler={openAddChipsModal}
              />
              <span style={{
                marginLeft: '3px',
                color: 'hsl(162, 100%, 28%)'
              }}>
                Argent fictif
              </span>
            </Hider>

            <Hider hideOnMobile>
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
            </Hider>

            <HamburgerButton clickHandler={openNavMenu} />
          </Spacer>
        </Container>
      </StyledNav>
    );
};

export default Navbar;
