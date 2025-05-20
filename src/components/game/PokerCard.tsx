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
  margin: 1rem 0.5rem;
  animation-duration: 0.5s;
  animation-fill-mode: both;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
  transition: all 0.5s;

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
    width: ${({ width }: StyledPokerCardWrapperProps) => width || '7vw'};
    max-width: ${({ maxWidth }: StyledPokerCardWrapperProps) => maxWidth || '80px'};
    min-width: ${({ minWidth }: StyledPokerCardWrapperProps) => minWidth || '50px'};
    box-shadow: 10px 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const PokerCard: React.FC<StyledPokerCardWrapperProps> = ({ card: { suit, rank }, width, minWidth, maxWidth }) => {
  const concat = suit + rank;

  return (
    <StyledPokerCardWrapper
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
    >
      {/* A revoir plus tard */}
      <img src={(cards[concat as keyof typeof cards] as unknown as { default: string }).default ||
        (cards[concat as keyof typeof cards] as unknown as string)} alt={concat} />
    </StyledPokerCardWrapper>
  );
};

export default PokerCard;
