import React, { useContext } from 'react';
import styled from 'styled-components';
import contentContext from '../../context/content/contentContext';
// import ChipsAmountPill from './ChipsAmountPill';
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
        <>
          {currentTable.pot !== 0 ? (
            <InfoPill>
              {`Pot: ${currentTable.pot} F CFA`}
            </InfoPill>
          ) : (
            <></>
          )}
        </>
      )}
    </Wrapper>
  );
};
