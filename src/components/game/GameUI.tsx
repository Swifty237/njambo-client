import React, { useContext } from 'react';
// import contentContext from '../../context/content/contentContext';
import Button from '../buttons/Button';
import { UIWrapper } from './UIWrapper';
import { CardProps } from '../../types/SeatTypesProps';
import gameContext from '../../context/game/gameContext';
import { Tooltip } from 'react-tooltip';

type GameUIProps = {
  currentTable: any; // Replace 'any' with the actual type if available
  seatId: string;
  standUp: () => void;
  playOneCard: (cards: CardProps, seatNumber: string) => void;
  showDown: () => void
};

export const GameUI: React.FC<GameUIProps> = ({
  currentTable,
  seatId,
  standUp,
  playOneCard,
  showDown
}) => {
  // const { getLocalizedString } = useContext(contentContext);
  const { elevatedCard } = useContext(gameContext);

  const handlePlayCard = () => {
    const seat = currentTable?.seats?.[seatId];
    if (elevatedCard) {
      // Extraire les informations de la carte depuis elevatedCard
      // Format: "seatId-suit-rank"
      const parts = elevatedCard.split('-');
      if (parts.length === 3) {
        const [cardSeatId, suit, rank] = parts;
        const card: CardProps = { suit, rank };
        playOneCard(card, cardSeatId);
        seat.turn = false;
      }
    }
  };

  return (
    <UIWrapper>
      <>
        <Button data-tooltip-id="play-tooltip" $small $secondary onClick={handlePlayCard}>
          {'Jouer'}
        </Button>
        <Tooltip id="play-tooltip" content={"Clique ici pour jouer la carte soulevée"} place="left" />
      </>

      <>
        <Button data-tooltip-id="stand-up-tooltip" $small $secondary onClick={standUp}>
          {'Se lever'}
        </Button>
        <Tooltip id="stand-up-tooltip" content={"Clique ici pour te lever de la table"} place="top" />
      </>

      <>
        <Button data-tooltip-id="showdown-tooltip" $small $secondary onClick={showDown}>
          {currentTable.seats[seatId].showingCards ? 'Cacher son jeu' : 'Montrer son jeu'}
          {/* {getLocalizedString('game_ui_showdown')} */}
        </Button>
        <Tooltip id="showdown-tooltip" content={"Clique ici pour montrer ou cacher ton jeu"} place="left" />
      </>
    </UIWrapper>
  );
};
