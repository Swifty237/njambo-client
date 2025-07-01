import React from 'react';
import PokerChip from '../icons/PokerChip';
import { Input } from '../forms/Input';
import styled from 'styled-components';
// import PropTypes from 'prop-types';

interface WrapperProps {
  theme: {
    colors: { primaryCta: string };
    other: { stdBorderRadius: string }
  }
}

interface ChipsAmountProps {
  chipsAmount: number;
  clickHandler: () => void;
};

const Wrapper = styled.div`
  position: relative;
  display: inline-block;

  & ${Input} {
    text-align: right;
    padding: 0.5rem 1rem 0.5rem 2rem;
    border-radius: ${(props: WrapperProps) => props.theme.other.stdBorderRadius};
    border: 1px solid ${(props: WrapperProps) => props.theme.colors.primaryCta};
  }
`;

const IconWrapper = styled.label`
  cursor: pointer;
  position: absolute;
  width: 40px;
  height: 40px;
  left: 0;
  top: calc(50% - 40px / 2);
`;

const ChipsAmount: React.FC<ChipsAmountProps> = ({ chipsAmount, clickHandler }) => {
  return (
    <Wrapper onClick={clickHandler}>
      <IconWrapper htmlFor="chipsAmount">
        <PokerChip width='70' height='70' />
      </IconWrapper>
      <Input
        disabled
        type="text"
        size={10}
        value={new Intl.NumberFormat(document.documentElement.lang).format(
          chipsAmount,
        )}
        name="chipsAmount"
      />
    </Wrapper>
  );
};

export default ChipsAmount;
