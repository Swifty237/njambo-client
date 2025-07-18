import React, { useContext } from 'react';
import styled from 'styled-components';
import CloseButton from '../buttons/CloseButton';
import Button from '../buttons/Button';
import Text from '../typography/Text';
import ColoredText from '../typography/ColoredText';
import ChipsAmount from '../user/ChipsAmount';
import RealChipsAmount from '../user/RealChipsAmount';
import { Link } from 'react-router-dom';
import lobbyIcon from '../../assets/icons/lobby-icon.png';
import newsIcon from '../../assets/icons/news-icon.png';
import userIcon from '../../assets/icons/user-icon.png';
import contentContext from '../../context/content/contentContext';
import Markdown from 'react-remarkable';
import socketContext from '../../context/websocket/socketContext';
import globalContext from '../../context/global/globalContext';
import { Select } from '../forms/Select';
import { ThemeProps } from '../../styles/theme';

interface StyledNavMenuProps {
  theme: ThemeProps;
}

interface NavMenuProps {
  onClose: () => void,
  logout: () => void,
  userName: string,
  chipsAmount: number,
  openModal: (...args: any[]) => void,
  lang: string,
  setLang: (langOption: string) => void,
}

const NavMenuWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
`;

const StyledNavMenu = styled.div`
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background-color: ${(props: StyledNavMenuProps) => props.theme.colors.lightestBg};
  box-shadow: ${(props: StyledNavMenuProps) => props.theme.other.navMenuDropShadow};
  overflow: hidden;

  @media screen and (max-width: 400px) {
    width: 85vw;
  }
`;

const MenuHeader = styled.div`
  padding: 0.5rem 1rem 0;
  justify-self: flex-start;
`;

const MenuItem = styled(Link)`
  display: flex;
  padding: 0.75rem 1rem;
  justify-content: space-between;
  width: 100%;
  text-align: right;
  font-family: ${(props: StyledNavMenuProps) => props.theme.fonts.fontFamilySansSerif};
  color: ${(props: StyledNavMenuProps) => props.theme.colors.primaryCta} !important;
  border-bottom: 1px solid ${(props: StyledNavMenuProps) => props.theme.colors.lightestBg};
  background-color: ${(props: StyledNavMenuProps) => props.theme.colors.lightBg} !important;
  font-size: ${(props: StyledNavMenuProps) => props.theme.fonts.fontSizeParagraph};
  font-weight: normal;

  &:hover {
    background-color: ${(props: StyledNavMenuProps) => props.theme.colors.goldenColor} !important;
  }

  &:focus {
    outline: none;
    border-left: 4px solid ${(props: StyledNavMenuProps) => props.theme.colors.primaryCta};
  }
`;

const MenuBody = styled.div`
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }
`;

const MenuFooter = styled.div`
  padding: 0.5rem;
  margin: auto 0 0 0;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  margin: 1.5rem auto;
  justify-content: space-between;
  align-items: center;

  ${Button} {
    min-width: 6.5rem;
  }
`;

const SalutationText = styled(Text)`
  font-family: ${(props: StyledNavMenuProps) => props.theme.fonts.fontFamilySerif};
  font-size: 1.5rem;
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
`;

const NavMenu = ({
  onClose,
  logout,
  userName,
  chipsAmount,
  openModal,
  lang,
  setLang,
}: NavMenuProps) => {
  const { players } = useContext(globalContext);
  const { getLocalizedString } = useContext(contentContext);
  const { cleanUp } = useContext(socketContext);

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

  return (
    <NavMenuWrapper
      id="wrapper"
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).id === 'wrapper') {
          onClose();
        }
      }}
    >
      <StyledNavMenu>
        <IconWrapper>
          <CloseButton clickHandler={onClose} autoFocus />
        </IconWrapper>

        <MenuHeader>
          <SalutationText textAlign="left">
            {getLocalizedString('main_page-salutation')}
            <br />
            <ColoredText>{userName}!</ColoredText>
          </SalutationText>

          <HorizontalWrapper>
            {players && (
              <SalutationText textAlign="left">
                Online: <ColoredText>{players.length}</ColoredText>
              </SalutationText>
            )}

            <Button onClick={openShopModal} $small $primary>
              {getLocalizedString('shop-coming_soon-modal_heading')}
            </Button>
          </HorizontalWrapper>


          <HorizontalWrapper>
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
                clickHandler={openShopModal}
              />

              <span style={{
                marginLeft: '5px',
                color: 'hsl(162, 100%, 28%)'
              }}>
                Argent fictif
              </span>
            </div>
          </HorizontalWrapper>

          <HorizontalWrapper>
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
                marginLeft: '5px',
                color: 'hsl(0, 100%, 46%)'
              }}>
                Argent réel
              </span>
            </div>
          </HorizontalWrapper>


          <HorizontalWrapper>
            <Select
              value={lang} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </Select>
          </HorizontalWrapper>
        </MenuHeader>

        <MenuBody>
          <MenuItem
            as={Link}
            to="/"
            onClick={() => {
              onClose();
            }}
          >
            {getLocalizedString('navmenu-menu_item-lobby_txt')}
            <img
              src={String(lobbyIcon)}
              alt="Lobby"
              width="25"
              style={{ width: '25px' }}
            />
          </MenuItem>
          <MenuItem
            as={Link}
            to="/dashboard"
            onClick={() => {
              onClose();
            }}
          >
            {getLocalizedString('navmenu-menu_item-dashboard_txt')}
            <img
              src={String(userIcon)}
              alt="Dashboard"
              width="25"
              style={{ width: '25px' }}
            />
          </MenuItem>
          <MenuItem
            as={Link}
            to="/news"
            onClick={() => {
              onClose();
            }}
          >
            {getLocalizedString('navmenu-menu_item-news_txt')}
            <img
              src={String(newsIcon)}
              alt="News"
              width="25"
              style={{ width: '25px' }}
            />
          </MenuItem>
        </MenuBody>
        <MenuFooter>
          <Button
            onClick={() => {
              cleanUp();
              logout();
              onClose();
            }}
            $secondary
            $fullWidth
            $small
          >
            {getLocalizedString('navmenu-logout_btn')}
          </Button>
        </MenuFooter>
      </StyledNavMenu>
    </NavMenuWrapper>
  );
};

export default NavMenu;
