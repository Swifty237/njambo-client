import React from 'react';
import styled from 'styled-components';
import table from '../../assets/game/table.svg';

const StyledPokerTable = styled.div`
  display: block;
  pointer-events: none;
  width: 95%;
  margin: 0 auto;
`;

const PokerTable = () => <StyledPokerTable src={table} alt="Tatami" />;

export default PokerTable;