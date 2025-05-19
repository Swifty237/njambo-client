import React from 'react';
import { BetSliderInput } from './BetSliderInput';
import { BetSliderWrapper } from './BetSliderWrapper';

interface BetSliderProps {
  currentTable: {
    minBet: number;
    callAmount: number;
    limit: number;
    seats: {
      [seatId: number]: {
        stack: number;
      };
    };
  };
  seatId: number;
  bet: number;
  setBet: (bet: number) => void;
};

export const BetSlider: React.FC<BetSliderProps> = ({ currentTable, seatId, bet, setBet }) => (
  <BetSliderWrapper>
    <BetSliderInput
      type="range"
      style={{ width: '100%' }}
      step="10"
      min={
        currentTable.minBet >= currentTable.callAmount
          ? currentTable.minBet
          : currentTable.callAmount
      }
      max={
        currentTable &&
        currentTable.seats &&
        currentTable.seats[seatId].stack &&
        (currentTable.seats[seatId].stack < currentTable.limit
          ? currentTable.seats[seatId].stack
          : currentTable.limit)
      }
      value={bet}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBet(+e.target.value)}
    />
  </BetSliderWrapper>
);
