import styled from 'styled-components';

export const PlayedHand = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 55;
  transition: all 0.3s ease;

  * ~ * {
    margin-left: -4rem;
    transition: margin-left 0.3s ease;
  }

  &:hover * ~ * {
    margin-left: -1.25rem;
  }
`;