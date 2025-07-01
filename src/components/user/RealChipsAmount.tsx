import React from 'react';
import RealPokerChip from '../icons/RealPokerChip';
import { Input } from '../forms/Input';
import styled from 'styled-components';
import { Tooltip } from 'react-tooltip';
// import PropTypes from 'prop-types';

interface WrapperProps {
    theme: {
        colors: { dangerColor: string };
        other: { stdBorderRadius: string }
    }
}

interface ChipsAmountProps {
    tooltip: string;
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
    border: 1px solid ${(props: WrapperProps) => props.theme.colors.dangerColor};
    color: ${(props: WrapperProps) => props.theme.colors.dangerColor};
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

const RealChipsAmount: React.FC<ChipsAmountProps> = ({ tooltip, chipsAmount, clickHandler }) => {
    return (
        <>
            <Wrapper data-tooltip-id="real-chips-tooltip" onClick={clickHandler}>
                <IconWrapper htmlFor="chipsAmount">
                    <RealPokerChip width='70' height='70' />
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
            <Tooltip id="real-chips-tooltip" content={tooltip} place="bottom" />
        </>
    );
};

export default RealChipsAmount;
