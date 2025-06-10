import React, { useContext } from 'react';
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
    isElevated ? '15px 15px 40px rgba(0, 0, 0, 0.2)' : '10px 10px 30px rgba(0, 0, 0, 0.1)'};
    transition: box-shadow 0.3s ease;
  }
`;

const HandCard: React.FC<StyledPokerCardWrapperProps> = ({
  card: { suit, rank }, width, minWidth, maxWidth }) => {
  const concat = suit + rank;
  const { seatId, elevatedCard, playOneCard, setElevatedCard, currentTable } = useContext(gameContext);
  const cardKey = `${seatId}-${suit}-${rank}`;
  const isElevated = elevatedCard === cardKey;

  // Vérifie si le joueur a une carte de la couleur demandée dans sa main
  const hasCardOfDemandedSuit = (demandedSuit: string): boolean => {
    if (!currentTable || !seatId) return false;
    const playerHand = currentTable.seats[seatId].hand;
    return playerHand.some(card => card.suit === demandedSuit);
  };

  const handleSingleClick = () => {
    if (setElevatedCard) {
      if (isElevated) {
        // Si la carte est déjà levée, l'abaisser
        setElevatedCard(null);
      } else {
        // Sinon, lever uniquement cette carte (remplace toutes les autres)
        setElevatedCard(cardKey);
      }
    }
  };

  const handleDoubleClick = () => {
    if (!currentTable || !seatId || !playOneCard) return;

    const isFirstCardOfRound = currentTable.currentRoundCards.length === 0;
    const isFirstRound = currentTable.roundNumber === 1;

    // Premier tour, première carte : aucune restriction
    if (isFirstRound && isFirstCardOfRound) {
      playOneCard({ suit, rank }, seatId);
      return;
    }

    // Premier tour, cartes suivantes : doit suivre la couleur demandée
    if (isFirstRound && !isFirstCardOfRound) {
      if (suit === currentTable.demandedSuit) {
        playOneCard({ suit, rank }, seatId);
      } else if (hasCardOfDemandedSuit(currentTable.demandedSuit)) {
        console.log("vous devez jouer la couleur demandée");
      } else {
        // Le joueur n'a pas la couleur demandée, il peut jouer n'importe quelle carte
        playOneCard({ suit, rank }, seatId);
      }
      return;
    }

    // Tours suivants
    if (!isFirstRound) {
      // Première carte du tour : aucune restriction
      if (isFirstCardOfRound) {
        playOneCard({ suit, rank }, seatId);
      } else {
        // Cartes suivantes : même logique que le premier tour
        if (suit === currentTable.demandedSuit) {
          playOneCard({ suit, rank }, seatId);
        } else if (hasCardOfDemandedSuit(currentTable.demandedSuit)) {
          console.log("vous devez jouer la couleur demandée");
        } else {
          // Le joueur n'a pas la couleur demandée, il peut jouer n'importe quelle carte
          playOneCard({ suit, rank }, seatId);
        }
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
      onClick={suit === 'hidden' && rank === 'hidden' ? undefined : handleClickEvents}
    >
      <img
        src={
          (cards[concat as keyof typeof cards] && ((cards[concat as keyof typeof cards] as any).default || cards[concat as keyof typeof cards])) || ''
        }
        alt={concat}
      />
    </StyledPokerCardWrapper>
  );
};

export default HandCard;
