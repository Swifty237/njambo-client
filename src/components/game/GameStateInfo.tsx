import React, { useContext } from 'react';
import styled from 'styled-components';
import contentContext from '../../context/content/contentContext';
import ChipsAmountPill from './ChipsAmountPill';
import { InfoPill } from './InfoPill';

const Wrapper = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(4, auto);
  justify-content: center;
  justify-items: center;
  align-items: center;
  width: 100%;
`;

export const GameStateInfo = ({ currentTable }: any) => {
  const { getLocalizedString } = useContext(contentContext);

  return (
    <Wrapper>
      {currentTable.players.length <= 1 || currentTable.handOver ? (
        <InfoPill>{getLocalizedString('game_state-info_wait')}</InfoPill>
      ) : (
        <InfoPill>
          {/* {currentTable.board.length === 0 && 'Pre-Flop'}
          {currentTable.board.length === 3 && 'Flop'}
          {currentTable.board.length === 4 && 'Turn'}
          {currentTable.board.length === 5 && 'River'} */}
          {currentTable.wentToShowdown && 'Showdown'}
        </InfoPill>
      )}

      {!!currentTable.mainPot && (
        <div style={{ minWidth: '150px' }}>
          <ChipsAmountPill chipsAmount={currentTable.mainPot} />
        </div>
      )}

      {currentTable.sidePots > 0 &&
        currentTable.sidePots.map((sidePot: { amount: number }, idx: number) => (
          <div style={{ minWidth: '150px' }} key={idx}>
            <ChipsAmountPill chipsAmount={sidePot.amount} />
          </div>
        ))}
    </Wrapper>
  );
};
