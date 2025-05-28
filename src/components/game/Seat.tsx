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
import PokerCard from './PokerCard';
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
import { PlayedCards } from './PlayedCards';

interface Player {
  name: string;
}

interface CardProps {
  suit: string,
  rank: string
}

interface SeatData {
  id: string;
  turn: boolean;
  stack: number;
  sittingOut: boolean;
  player: Player;
  bet: number;
  hand: CardProps[];
  lastAction?: string;
}

interface Table {
  id: string;
  name: string;
  seats: { [seatId: string]: SeatData };
  limit: number;
  minBet: number;
  callAmount: number;
  pot: number;
  minRaise: number;
  board: CardProps[];
  winMessages: string;
  button: string;
  handOver: boolean;
}

interface SeatProps {
  currentTable: Table;
  seatNumber: string;
  isPlayerSeated: boolean;
  sitDown: (tableId: string, seatNumber: string, amount: number) => void;
}


export const Seat: React.FC<SeatProps> = ({ currentTable, seatNumber, isPlayerSeated, sitDown }) => {
  const { openModal, closeModal } = useContext(modalContext);
  const { chipsAmount } = useContext(globalContext);
  const { standUp, seatId, rebuy } = useContext(gameContext);
  const { getLocalizedString } = useContext(contentContext);

  const seat = currentTable.seats[seatNumber];
  const maxBuyin = currentTable.limit;
  const minBuyIn = currentTable.minBet * 2 * 10;

  const getPosition = (id: string | null) => {
    switch (id) {
      case '1':
        return {
          top: "3vh",
          left: "8vw"
        };
      case '2':
        return {
          top: "20vh",
        };
      case '3':
        return {
          top: "2vh",
          right: "6vw"
        };
      case '4':
        return {
          bottom: "20vh",
        };
      default:
        return {};
    }
  }

  const getCardsPosition = (id: string | null) => {

    if (id === "1" || id === "3") {
      return {
        top: "5.5vh",
      }
    } else {
      return {
        left: "4.7vh",
      }
    }
  }

  const getPlayedCardsPosition = (id: string | null) => {
    switch (id) {
      case '1':
        if (seat.hand.length === 1) {
          return {
            top: "-7vh",
            left: "8vw"
          };
        } else if (seat.hand.length === 2) {
          return {
            top: "-7vh",
            left: "7vw"
          };
        } else if (seat.hand.length === 3) {
          return {
            top: "-7vh",
            left: "6vw"
          };
        } else if (seat.hand.length === 4) {
          return {
            top: "-7vh",
            left: "5vw"
          };
        } else if (seat.hand.length === 5) {
          return {
            top: "-7vh",
            left: "4vw"
          };
        } else {
          return
        }

      case '2':
        return {
          top: "6vh",
        };
      case '3':

        if (seat.hand.length === 1) {
          return {
            top: "-7vh",
            right: "8vw"
          };
        } else if (seat.hand.length === 2) {
          return {
            top: "-7vh",
            right: "7vw"
          };
        } else if (seat.hand.length === 3) {
          return {
            top: "-7vh",
            right: "6vw"
          };
        } else if (seat.hand.length === 4) {
          return {
            top: "-7vh",
            right: "5vw"
          };
        } else if (seat.hand.length === 5) {
          return {
            top: "-7vh",
            right: "4vw"
          };
        } else {
          return
        }

      case '4':
        return {
          bottom: "6vh",
        };
      default:
        return {};
    }
  }

  useEffect(() => {
    if (
      currentTable &&
      isPlayerSeated &&
      seat &&
      seat.id === seatId &&
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
                          sitDown(
                            currentTable.id,
                            seatNumber,
                            amount,
                          );
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
          }}
        >
          <PositionedUISlot
            top={(seatId === "4") ? "4.25rem" : "-9.25rem"}
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
            {...getCardsPosition(seatId)}
            style={{
              display: 'flex',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            origin="center right"
          >
            <Hand>
              {seat.hand &&
                seat.hand.map((card: CardProps, index: number) => (
                  <PokerCard
                    key={index}
                    card={card}
                    width="5vw"
                    maxWidth="60px"
                    minWidth="30px"
                  />
                ))}
            </Hand>
          </PositionedUISlot>

          {currentTable.button === seatNumber && (
            <PositionedUISlot
              right="35px"
              origin="center left"
              style={{ zIndex: '55' }}
            >
              <DealerButton />
            </PositionedUISlot>
          )}

          <PositionedUISlot
            {...getPosition(seatId)}
            style={{ zIndex: '55', position: 'relative' }}
            origin="bottom center"
          >
            <ChipsAmountPill
              position={seatId as '1' | '2' | '3' | '4'}
              chipsAmount={seat.bet}
            />
            {!currentTable.handOver && seat.lastAction && (
              <InfoPill>{seat.lastAction}</InfoPill>
            )}
          </PositionedUISlot>

          <PositionedUISlot
            {...getPlayedCardsPosition(seatId)}
            style={{
              display: 'flex',
              textAlign: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            origin="center right"
          >
            <PlayedCards>
              {seat.hand &&
                seat.hand.map((card: CardProps, index: number) => (
                  <PokerCard
                    key={index}
                    card={card}
                    width="5vw"
                    maxWidth="60px"
                    minWidth="30px"
                  />
                ))}
            </PlayedCards>

          </PositionedUISlot>
        </PositionedUISlot>
      )}

    </StyledSeat>
  );
};
