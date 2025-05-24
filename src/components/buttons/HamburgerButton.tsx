import React from 'react';
// import PropTypes from 'prop-types';
import HamburgerIcon from '../icons/HamburgerIcon';
import styled from 'styled-components';

interface StyledHamburgerButtonProps {
  theme: { colors: { primaryCtaDarker: string } }
}

interface HamburgerButtonProps {
  clickHandler: () => void;
}

const StyledHamburgerButton = styled.div`
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 2px solid rgba(0, 0, 0, 0);

  &:focus {
    outline: none;
    border: 2px solid ${(props: StyledHamburgerButtonProps) => props.theme.colors.primaryCtaDarker};
    border-radius: 50%;
  }
`;

const HamburgerButton = ({ clickHandler }: HamburgerButtonProps) => {
  return (
    <StyledHamburgerButton
      onClick={clickHandler}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.keyCode === 13) clickHandler();
      }}
      tabIndex={0}
    >
      <HamburgerIcon />
    </StyledHamburgerButton>
  );
};

export default HamburgerButton;
