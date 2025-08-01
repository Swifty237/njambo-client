import React from 'react';
import styled from 'styled-components';
import cards from './cards';


interface StyledPokerCardWrapperProps {
  card: {
    suit: string,
    rank: string
  }
  width: string;
  maxWidth: string;
  minWidth: string;
}

const StyledPokerCardWrapper = styled.div`
  display: inline-block;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
  transition: opacity 0.5s ease, transform 0.5s ease;
  transform: translateZ(0); /* Force hardware acceleration */

  @keyframes fadeInUp {
    from {
      -webkit-transform: translate3d(0, 40px, 0);
      transform: translate3d(0, 40px, 0);
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeInUp {
    from {
      -webkit-transform: translate3d(0, 40px, 0);
      transform: translate3d(0, 40px, 0);
    }

    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  img {
    width: ${({ width }: StyledPokerCardWrapperProps) => width};
    max-width: ${({ maxWidth }: StyledPokerCardWrapperProps) => maxWidth};
    min-width: ${({ minWidth }: StyledPokerCardWrapperProps) => minWidth};
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const PlayedCard: React.FC<StyledPokerCardWrapperProps> = ({ card: { suit, rank }, width, minWidth, maxWidth }) => {
  const concat = suit + rank;

  return (
    <StyledPokerCardWrapper
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
    >
      {/* A revoir plus tard */}
      <img
        src={
          (cards[concat as keyof typeof cards] && ((cards[concat as keyof typeof cards] as any).default || cards[concat as keyof typeof cards])) || ''
        }
        alt={concat}
      />
    </StyledPokerCardWrapper>
  );
};

export default PlayedCard;
