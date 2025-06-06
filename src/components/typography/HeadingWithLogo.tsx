import React from 'react';
import Heading from './Heading';
import LogoIcon from '../logo/LogoIcon';
import styled from 'styled-components';
// import PropTypes from 'prop-types';
import Hider from '../layout/Hider';

interface StyledHeadingWithLogoProps {
  theme: {
    colors: { primaryCta: string };
    fonts: { fontSizeH3: string }
  };
}

interface HeadingWithLogoProps {
  children: React.ReactNode;
  textCentered?: boolean;
  textCenteredOnMobile?: boolean;
  hideIconOnMobile?: boolean;
}

const StyledHeadingWithLogo = styled.div`
  svg {
    margin-right: 0.5rem;
    width: ${(props: StyledHeadingWithLogoProps) => props.theme.fonts.fontSizeH3};
  }

  ${Heading} {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    color: ${(props: StyledHeadingWithLogoProps) => props.theme.colors.primaryCta};
  }
`;

const HeadingWithLogo: React.FC<HeadingWithLogoProps> = ({
  children,
  textCentered = false,
  textCenteredOnMobile = false,
  hideIconOnMobile = true,
}) => {
  return (
    <StyledHeadingWithLogo>
      <Heading
        as="h2"
        headingClass="h4"
        textCentered={textCentered}
        textCenteredOnMobile={textCenteredOnMobile}
      >
        {hideIconOnMobile ? (
          <Hider hideOnMobile>
            <LogoIcon />
          </Hider>
        ) : (
          <LogoIcon />
        )}{' '}
        {children}
      </Heading>
    </StyledHeadingWithLogo>
  );
};

// HeadingWithLogo.propTypes = {
//   text: PropTypes.string,
//   textCentered: PropTypes.bool,
//   textCenteredOnMobile: PropTypes.bool,
//   hideIconOnMobile: PropTypes.bool,
// };

// HeadingWithLogo.defaultProps = {
//   textCentered: false,
//   textCenteredOnMobile: false,
//   hideIconOnMobile: true,
// };

export default HeadingWithLogo;
