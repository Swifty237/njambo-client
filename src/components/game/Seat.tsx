import React, { useContext, useEffect } from 'react';
import Button from '../buttons/Button';
import modalContext from '../../context/modal/modalContext';
import globalContext from '../../context/global/globalContext';
import { ButtonGroup } from '../forms/ButtonGroup';
import { Form } from '../forms/Form';
import { FormGroup } from '../forms/FormGroup';
import { Input } from '../forms/Input';
import gameContext from '../../context/game/gameContext';
import { PositionedUISlot } from './PositionedUISlot';
import { InfoPill } from './InfoPill';
import HandCard from './HandCard';
import ChipsAmountPill from './ChipsAmountPill';
import ColoredText from '../typography/ColoredText';
import PokerChip from '../icons/PokerChip';
import { EmptySeat } from './EmptySeat';
import { OccupiedSeat } from './OccupiedSeat';
import { Hand } from './Hand';
import { NameTag } from './NameTag';
import contentContext from '../../context/content/contentContext';
import Markdown from 'react-remarkable';
import DealerButton from '../icons/DealerButton';
import { StyledSeat } from './StyledSeat';
import { PlayedHand } from './PlayedHand';
import { SeatProps, CardProps } from '../../types/SeatTypesProps'
import PlayedCard from './PlayedCard';

export const Seat: React.FC<SeatProps> = ({ currentTable, seatNumber, isPlayerSeated, sitDown }) => {
  const { openModal, closeModal } = useContext(modalContext);
  const { chipsAmount } = useContext(globalContext);
  const { standUp, rebuy, getHandsPosition } = useContext(gameContext);
  const { getLocalizedString } = useContext(contentContext);

  const seat = currentTable.seats[seatNumber];
  const minBuyIn = currentTable.bet * 10;
  const maxBuyin = currentTable.bet * 10 * 5;

  const isHiddenCards = (): boolean => {
    if (!seat.hand || seat.hand.length === 0) {
      return false;
    }
    return seat.hand.every(card => card.rank === 'hidden' && card.suit === 'hidden');
  }

  useEffect(() => {
    if (
      currentTable &&
      isPlayerSeated &&
      seat &&
      seat.id === seatNumber &&
      seat.stack === 0 &&
      seat.sittingOut
    ) {
      if (chipsAmount <= minBuyIn || chipsAmount === 0) {
        standUp();
      } else {
        openModal(
          () => (
            <Form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();

                const amountInput = document.getElementById('amount') as HTMLInputElement | null;
                const amount = amountInput ? + amountInput.value : 0;

                if (
                  amount &&
                  amount >= minBuyIn &&
                  amount <= chipsAmount &&
                  amount <= maxBuyin
                ) {
                  rebuy(currentTable.id, seatNumber, amount);
                  closeModal();
                }
              }}
            >
              <FormGroup>
                <Input
                  id="amount"
                  type="number"
                  min={minBuyIn}
                  max={chipsAmount <= maxBuyin ? chipsAmount : maxBuyin}
                  defaultValue={minBuyIn}
                />
              </FormGroup>
              <ButtonGroup>
                <Button $primary type="submit" $fullWidth>
                  {getLocalizedString('game_rebuy-modal_confirm')}
                </Button>
              </ButtonGroup>
            </Form>
          ),
          getLocalizedString('game_rebuy-modal_header'),
          getLocalizedString('game_rebuy-modal_cancel'),
          () => {
            standUp();
            closeModal();
          },
          () => {
            standUp();
            closeModal();
          },
        );
      }
    }
    // eslint-disable-next-line
  }, [currentTable]);

  return (
    <StyledSeat>
      {!seat ? (
        <>
          {!isPlayerSeated ? (
            <Button
              $small
              onClick={() => {
                openModal(() => (
                  <Form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();

                      const amountInput = document.getElementById('amount') as HTMLInputElement | null;
                      const amount = amountInput ? + amountInput.value : 0;

                      if (
                        amount &&
                        amount >= minBuyIn &&
                        amount <= chipsAmount &&
                        amount <= maxBuyin
                      ) {
                        sitDown(
                          currentTable.id,
                          seatNumber,
                          amount,
                        );
                        closeModal();
                      }
                    }}>
                    <FormGroup>
                      <Input
                        id="amount"
                        type="number"
                        min={minBuyIn}
                        max={chipsAmount <= maxBuyin ? chipsAmount : maxBuyin}
                        defaultValue={minBuyIn}
                      />
                    </FormGroup>
                    <ButtonGroup>
                      <Button $primary type="submit" $fullWidth>
                        {getLocalizedString('game_buyin-modal_confirm')}
                      </Button>
                    </ButtonGroup>
                  </Form>
                ),
                  getLocalizedString('game_buyin-modal_header'),
                  getLocalizedString('game_buyin-modal_cancel'),
                );
              }}
            >
              {getLocalizedString('game_sitdown-btn')}
            </Button>
          ) : (
            <EmptySeat>
              <Markdown>{getLocalizedString('game_table_empty-seat')}</Markdown>
            </EmptySeat>
          )}
        </>
      ) : (
        <PositionedUISlot
          style={{
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "black"
          }}>
          <PositionedUISlot
            top={(seatNumber === "4") ? "4.25rem" : "-9.25rem"}
            left="-100px"
            origin="top center"
          >
            <NameTag>
              <ColoredText primary style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)" }}>
                <span style={{
                  fontSize: "22px",
                  backgroundColor: "#ecf0f1",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  {seat.player.name}
                </span>

                {seat.stack && (
                  <div style={{
                    minWidth: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    backgroundColor: "rgba(0, 0, 0)",
                    paddingRight: "10px",
                    borderRadius: "10px"
                  }}>
                    <PokerChip width="38" height="38" />
                    <div>
                      <ColoredText secondary style={{ marginRight: "7px", fontSize: "22px" }}>
                        {new Intl.NumberFormat(
                          document.documentElement.lang,
                        ).format(seat.stack)}
                      </ColoredText>
                      <ColoredText secondary>{'F CFA'}</ColoredText>
                    </div>
                  </div>
                )}
              </ColoredText>
            </NameTag>
          </PositionedUISlot>

          <PositionedUISlot>
            <OccupiedSeat seatNumber={seatNumber} hasTurn={seat.turn} />
          </PositionedUISlot>

          <PositionedUISlot
            style={{
              display: 'flex',
              ...getHandsPosition(seatNumber)
            }}
            origin="center right"
          >
            <Hand hiddenCards={isHiddenCards()}>
              {seat.hand && seat.hand.map((card: CardProps, index: number) => (
                <HandCard
                  key={`${card.suit}-${card.rank}-${index}`}
                  card={card}
                  width="5vw"
                  maxWidth="60px"
                  minWidth="30px"
                />
              ))}
            </Hand>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {seat.bet && (seatNumber === '3' || seatNumber === '4') &&
                <ChipsAmountPill
                  chipsAmount={seat.bet}
                  seatPosition={seatNumber as '1' | '2' | '3' | '4'}
                />
              }

              <PlayedHand>
                {seat.playedHand &&
                  seat.playedHand.map((card: CardProps, index: number) => (
                    <PlayedCard
                      key={index}
                      card={card}
                      width="5vw"
                      maxWidth="60px"
                      minWidth="30px"
                    />
                  ))}
              </PlayedHand>

              {seat.bet && (seatNumber === '1' || seatNumber === '2') &&
                <ChipsAmountPill
                  chipsAmount={seat.bet}
                  seatPosition={seatNumber as '1' | '2' | '3' | '4'}
                />
              }
            </div>
          </PositionedUISlot>

          {currentTable.button === seatNumber && (
            <PositionedUISlot
              right={seatNumber === '1' || seatNumber === '2' ? '38px' : 'auto'}
              left={seatNumber === '3' || seatNumber === '4' ? '38px' : 'auto'}
              origin={seatNumber === '1' || seatNumber === '2' ? 'center left' : 'center right'}
              style={{ zIndex: '55' }}
            >
              <DealerButton />
            </PositionedUISlot>
          )}

          <PositionedUISlot
            style={{ zIndex: '55', position: 'relative' }}
            origin="bottom center"
          >
            {!currentTable.handOver && seat.lastAction && (
              <InfoPill>{seat.lastAction}</InfoPill>
            )}
          </PositionedUISlot>
        </PositionedUISlot>
      )}
    </StyledSeat>
  );
};
