import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import cards from './cards';
import useClickHandler from '../../hooks/useClickHandler';
import gameContext from '../../context/game/gameContext';

interface StyledPokerCardWrapperProps {
  card: {
    suit: string,
    rank: string
  }
  width: string;
  maxWidth: string;
  minWidth: string;
  isElevated?: boolean;
}

const StyledPokerCardWrapper = styled.div`
  display: inline-block;
  margin: 1rem 0.5rem;
  position: relative; /* Nécessaire pour utiliser top */
  animation-duration: 0.5s;
  animation-fill-mode: both;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  opacity: 0;
  animation-name: fadeInUp;
  -webkit-animation-name: fadeInUp;
  transition: all 0.3s ease;
  cursor: pointer;

  top: ${({ isElevated }: StyledPokerCardWrapperProps) => isElevated ? '-20px' : '0px'};

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
    box-shadow: ${({ isElevated }: StyledPokerCardWrapperProps) =>
    isElevated
      ? '15px 15px 40px rgba(0, 0, 0, 0.2)' // Ombre plus prononcée quand élevé
      : '10px 10px 30px rgba(0, 0, 0, 0.1)'
  };
    transition: box-shadow 0.3s ease;
  }
`;

const PokerCard: React.FC<StyledPokerCardWrapperProps> = ({ card: { suit, rank }, width, minWidth, maxWidth }) => {
  const concat = suit + rank;
  const { playCard, elevatedCard, setElevatedCard, seatId } = useContext(gameContext);
  const cardKey = `${seatId}-${suit}-${rank}`;
  const isElevated = elevatedCard === cardKey;

  const handleSingleClick = () => {
    if (isElevated) {
      setElevatedCard(null);
    } else {
      setElevatedCard(cardKey);
    }
  };

  const handleDoubleClick = () => {
    if (seatId && playCard) {
      playCard({ suit, rank }, seatId);

      // Abaisser la carte si elle était élevée
      if (isElevated && setElevatedCard) {
        setElevatedCard(null);
      }
    }
  };

  const handleClickEvents = useClickHandler(handleSingleClick, handleDoubleClick);

  return (
    <StyledPokerCardWrapper
      card={{ suit, rank }}
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      isElevated={isElevated}
      onClick={handleClickEvents}
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

export default PokerCard;
