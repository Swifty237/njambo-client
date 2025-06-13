import React, { useContext } from 'react';
// import contentContext from '../../context/content/contentContext';
import Button from '../buttons/Button';
import { UIWrapper } from './UIWrapper';
import { CardProps } from '../../types/SeatTypesProps';
import gameContext from '../../context/game/gameContext';

type GameUIProps = {
  currentTable: any; // Replace 'any' with the actual type if available
  seatId: string;
  bet: number;
  setBet: (bet: number) => void;
  standUp: () => void;
  check: () => void;
  playOneCard: (cards: CardProps, seatNumber: string) => void;
  showDown: () => void
};

export const GameUI: React.FC<GameUIProps> = ({
  currentTable,
  seatId,
  bet,
  setBet,
  standUp,
  check,
  playOneCard,
  showDown
}) => {
  // const { getLocalizedString } = useContext(contentContext);
  const { elevatedCard } = useContext(gameContext);

  const handlePlayCard = () => {
    if (elevatedCard) {
      // Extraire les informations de la carte depuis elevatedCard
      // Format: "seatId-suit-rank"
      const parts = elevatedCard.split('-');
      if (parts.length === 3) {
        const [cardSeatId, suit, rank] = parts;
        const card: CardProps = { suit, rank };
        playOneCard(card, cardSeatId);
      }
    } else {
      console.log("selectionner une carte");
    }
  };

  return (
    <UIWrapper>
      <Button $small $secondary onClick={handlePlayCard}>
        {'Jouer'}
      </Button>

      <Button
        $small
        $secondary
        disabled={
          currentTable.callAmount !== currentTable.seats[seatId].bet &&
          currentTable.callAmount > 0
        }
        onClick={check}
      >
        {'Passer'}
        {/* {getLocalizedString('game_ui_check')} */}
      </Button>

      <Button $small $secondary onClick={standUp}>
        {'Se lever'}
        {/* {getLocalizedString('game_ui_stand-up')} */}
      </Button>

      <Button $small $secondary onClick={showDown}>
        {'Montrer son jeu'}
        {/* {getLocalizedString('game_ui_showdown')} */}
      </Button>
    </UIWrapper>
  );
};
