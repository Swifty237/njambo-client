import styled from 'styled-components';

export const StyledSeat = styled.div`
 width: 5vw;
    height: 5vw;
    border: 3px solid;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: white;
    display: flex;
    justify-content: center;
    align-items: center;

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
