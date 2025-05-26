import React from 'react';
import PokerChip from '../icons/PokerChip';
// import { Input } from '../forms/Input';
import styled from 'styled-components';
import ColoredText from '../typography/ColoredText';
import theme from '../../styles/theme';
// import PropTypes from 'prop-types';

interface ChipsAmountPillProps {
  chipsAmount: number;
}

const Wrapper = styled.div`
  position: relative;
  box-shadow: 0 10px 10px rgba(0, 0, 0, .5);
  background-color:rgba(236, 240, 241, 0.1);
  height: 45px;
  display: flex;
  justify-content: end;
  align-items: center;
  padding-right: 10px;
  width: auto;
`;

const IconWrapper = styled.label`
  position: absolute;
  z-index: 5;
  left: 5px;
  top: 5px;
`;

const ChipsAmountPill: React.FC<ChipsAmountPillProps> = ({ chipsAmount }) => {
  return (
    <Wrapper>
      <IconWrapper htmlFor="chipsAmount">
        <PokerChip width="60" height="60" viewBox="7 7 38 38" injectedTheme={theme.colors.primaryCtaDarker} />
      </IconWrapper>

      <ColoredText primary style={{ fontSize: "22px" }}>
        {new Intl.NumberFormat(document.documentElement.lang).format(chipsAmount)}
        <span style={{ marginLeft: "5px", fontSize: "15px" }}>{"F CFA"}</span>
      </ColoredText>
    </Wrapper>
  );
};

export default ChipsAmountPill;
