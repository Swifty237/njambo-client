import styled from 'styled-components';

export const ResponsiveTable = styled.div`
  width: 32vw;
  height: 67vh;
  position: relative;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0);

  @media (max-width: 3000px) {
    width: 39vw;
    height: 67vh;
  }

  @media (max-width: 2000px) {
    width: 60vw;
    height: 67vh;
  }

  @media (max-width: 670px) {
    width: 70vw;
    height: 35vw;
  }

  @media (max-width: 400px) {
    width: 98vw;
    height: 50vw;
  }
`;