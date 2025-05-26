import styled from 'styled-components';

export const EmptySeat = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 5vw;
  height: 5vw;
  padding: 1rem;
  border-radius: 100%;
  background: rgba(247, 242, 220, 0.8);
  border: 5px solid #0da578;
  transition: all 0.1s;

  p {
    margin-bottom: 0;
  }

  @media (max-width: 2000px) {
        width: 7vw;
        height: 7vw;
    }

     @media (max-width: 1350px) {
        width: 10vw;
        height: 10vw;
    }

    @media (max-width: 1000px) {
        width: 14vw;
        height: 14vw;
    }

    @media (max-width: 700px) {
        width: 18vw;
        height: 18vw;
    }
`;
