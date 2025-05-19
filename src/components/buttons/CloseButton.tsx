import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CloseIcon from '../icons/CloseIcon';

interface StyledCloseIconProps {
  theme: any; // Replace 'any' with your theme type if available
}

interface CloseButtonProps {
  clickHandler: () => void;
}

const StyledCloseIcon = styled.div`
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 2px solid rgba(0, 0, 0, 0);

  &:focus {
    outline: none;
    border: 2px solid ${(props: StyledCloseIconProps) => props.theme.colors.primaryCtaDarker};
    border-radius: 50%;
  }
`;

const CloseButton = ({ clickHandler }: CloseButtonProps) => {
  return (
    <StyledCloseIcon
      onClick={clickHandler}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.keyCode === 13) clickHandler();
      }}
      tabIndex={0}
    >
      <CloseIcon />
    </StyledCloseIcon>
  );
};

CloseButton.propTypes = {
  clickHandler: PropTypes.func,
};

export default CloseButton;
