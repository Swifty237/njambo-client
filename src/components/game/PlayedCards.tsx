import styled from 'styled-components';

export const PlayedCards = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 55;

  * ~ * {
    margin-left: -1.25rem;
  }
`;