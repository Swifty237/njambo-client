import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Button from '../buttons/Button';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import contentContext from '../../context/content/contentContext';

interface StyledCookieBannerProps {
  theme: any;
}

interface ContentProps {
  theme: any;
}

interface CookieBannerProps {
  clickHandler: () => void;
  className?: string;
}

const Wrapper = styled.div`
  position: fixed;
  padding: 0 1.5rem;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  text-align: center;
  pointer-events: none;
`;

const StyledCookieBanner = styled.div`
  background-color: ${(props: StyledCookieBannerProps) => props.theme.colors.playingCardBg};
  color: ${(props: StyledCookieBannerProps) => props.theme.colors.fontColorDark};
  padding: 0.5rem;
  font-size: 1rem;
  text-align: center;
  width: 100%;
  max-width: 760px;
  margin: 1rem auto 1.5rem auto;
  display: flex;
  border-radius: calc(${(props: StyledCookieBannerProps) => props.theme.other.stdBorderRadius} - 1rem);
  box-shadow: ${(props: StyledCookieBannerProps) => props.theme.other.cardDropShadow};
  pointer-events: all;
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;

  @media screen and (max-width: 468px) {
    flex-direction: column;
  }
`;

const Content = styled.div`
  padding: 1em;
  color: ${(props: ContentProps) => props.theme.colors.fontColorDark};
  font-size: 0.85rem;
  text-align: left;
  width: 70%;

  @media screen and (max-width: 468px) {
    width: 100%;
    padding: 0.5em;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 30%;

  & > ${Button} {
    margin: 0.5em;
    min-width: 6rem;
    font-size: 0.85rem;
  }

  @media screen and (max-width: 468px) {
    width: 100%;
    justify-content: center;
  }
`;

const CookieBanner = ({ clickHandler, className }: CookieBannerProps) => {

  const { getLocalizedString }: any = useContext(contentContext); // => A typer proprement plus tard

  const portalTarget = document.getElementById('cookie-banner');
  if (!portalTarget) return null;

  return ReactDOM.createPortal(
    <Wrapper className={className}>
      <StyledCookieBanner>
        <ContentWrapper>
          <Content>{getLocalizedString('cookiebanner-text')}</Content>
          <ButtonWrapper>
            <Button small primary onClick={clickHandler}>
              {getLocalizedString('cookiebanner-confirm_btn_txt')}
            </Button>
            <Button as={Link} to="/privacy" secondary small>
              {getLocalizedString('cookiebanner-info_btn_txt')}
            </Button>
          </ButtonWrapper>
        </ContentWrapper>
      </StyledCookieBanner>
    </Wrapper>,
    portalTarget,
  );
};

// CookieBanner.propTypes = {
//   clickHandler: PropTypes.func.isRequired,
// };

export default CookieBanner;
