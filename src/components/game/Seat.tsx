import React, { useContext, useEffect, useRef } from 'react';
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
import { Tooltip } from 'react-tooltip';

export const Seat: React.FC<SeatProps> = ({ currentTable, seatNumber, isPlayerSeated, sitDown }) => {
  const { openModal, closeModal } = useContext(modalContext);
  const { chipsAmount } = useContext(globalContext);
  const { standUp, rebuy, getHandsPosition } = useContext(gameContext);
  const { getLocalizedString } = useContext(contentContext);
  const storedSeatId = localStorage.getItem("seatId");
  const turnStartTimeRef = useRef<number | undefined>(undefined);

  const seat = currentTable?.seats?.[seatNumber];
  const minBuyIn = (currentTable?.bet || 0) * 10;
  const maxBuyIn = (currentTable?.bet || 0) * 10 * 5;

  const isHiddenCards = (): boolean => {
    if (!seat?.hand || seat.hand.length === 0) {
      return false;
    }

    // Si le joueur a choisi de montrer ses cartes, on ne les cache pas
    if (seat?.showingCards) {
      return false;
    }

    return seat.hand.every(card => card.rank === 'hidden' && card.suit === 'hidden');
  }

  useEffect(() => {
    if (
      currentTable &&
      isPlayerSeated &&
      seat?.id === seatNumber &&
      seat?.stack === 0 &&
      seat?.sittingOut
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
                  amount <= maxBuyIn
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
                  max={chipsAmount <= maxBuyIn ? chipsAmount : maxBuyIn}
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

  // Gérer le turnStartTime pour éviter les re-renders inutiles
  useEffect(() => {
    if (seat?.turn) {
      // Si c'est un nouveau tour (pas encore de turnStartTime ou le serveur a un nouveau turnStartTime)
      if (!turnStartTimeRef.current || (seat.turnStartTime && seat.turnStartTime !== turnStartTimeRef.current)) {
        turnStartTimeRef.current = seat.turnStartTime || Date.now();
      }
    } else {
      // Réinitialiser quand ce n'est plus le tour du joueur
      turnStartTimeRef.current = undefined;
    }
  }, [seat?.turn, seat?.turnStartTime]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     // Reconnexion automatique après refresh de page
  //     if (currentTable && storedSeatId && !isPlayerSeated) {
  //       const storedPlayerSeated = localStorage.getItem("isPlayerSeated");
  //       if (storedPlayerSeated === "true" && currentTable.seats[storedSeatId]) {

  //         const currentSeat = currentTable.seats[storedSeatId];
  //         if (currentSeat && currentSeat.stack) {
  //           sitDown(currentTable.id, storedSeatId, currentSeat.stack);
  //         }

  //       }
  //     }
  //   }, 200); // Délai pour s'assurer que tout est chargé
  // }, [currentTable, storedSeatId, isPlayerSeated, sitDown]);

  return (
    <StyledSeat>
      {!seat ? (
        <>
          {!isPlayerSeated ? (
            <>
              <Button
                data-tooltip-id="sitdown-tooltip"
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
                          amount <= maxBuyIn
                        ) {
                          sitDown(
                            currentTable?.id || '',
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
                          max={chipsAmount <= maxBuyIn ? chipsAmount : maxBuyIn}
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
              <Tooltip id="sitdown-tooltip" content={"Clique ici pour t'asseoir"} place="bottom" />
            </>
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
            position: 'relative'
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
                  {seat?.player?.name || ''}
                </span>

                {seat?.stack && (
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
                        ).format(seat?.stack || 0)}
                      </ColoredText>
                      <ColoredText secondary>{'XAF'}</ColoredText>
                    </div>
                  </div>
                )}
              </ColoredText>
            </NameTag>
          </PositionedUISlot>

          <PositionedUISlot>
            <OccupiedSeat
              seatNumber={seatNumber}
              hasTurn={seat?.turn || false}
              turnStartTime={turnStartTimeRef.current}
            />
          </PositionedUISlot>

          <PositionedUISlot
            style={{
              ...getHandsPosition(seatNumber),
              zIndex: 999,
            }}
            origin="center right"
          >
            <>
              <Hand
                data-tooltip-id="hand-card-tooltip"
                hiddenCards={isHiddenCards()}
              >
                {seat?.hand && seat.hand.map((card: CardProps, index: number) => (
                  <HandCard
                    key={`${card.suit}-${card.rank}-${index}`}
                    card={card}
                    width="5vw"
                    maxWidth="60px"
                    minWidth="30px"
                  />
                ))}
              </Hand>
              <Tooltip id="hand-card-tooltip" content={"Un clic pour soulever une carte ou double clic pour jouer"} place={seatNumber === "1" || "2" ? "right" : "left"} />
            </>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <>
                <PlayedHand
                  data-tooltip-id="played-cards-tooltip"
                >
                  {seat?.playedHand &&
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
                <Tooltip id="played-cards-tooltip" content={`Carte(s) jouée(s) par ${seat.player.name}`} place={seatNumber === "1" || "2" ? "left" : "right"} />
              </>
            </div>
          </PositionedUISlot>

          {currentTable?.button === seatNumber && (
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
            {currentTable?.handOver && seat?.lastAction && seat.lastAction !== 'PLAY_ONE_CARD' && (
              <InfoPill>{seat.lastAction}</InfoPill>
            )}
          </PositionedUISlot>
        </PositionedUISlot>
      )}
    </StyledSeat>
  );
};
