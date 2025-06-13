import React, { useContext, useEffect, useState } from 'react';
import Container from '../components/layout/Container';
import Button from '../components/buttons/Button';
import gameContext from '../context/game/gameContext';
import socketContext from '../context/websocket/socketContext';
// import PokerTable from '../components/game/PokerTable';
import { RotateDevicePrompt } from '../components/game/RotateDevicePrompt';
import { PositionedUISlot } from '../components/game/PositionedUISlot';
import { PositionedUISeat } from '../components/game/PositionedUISeat';
import { PokerTableWrapper } from '../components/game/PokerTableWrapper';
import { Seat } from '../components/game/Seat';
import Text from '../components/typography/Text';
import modalContext from '../context/modal/modalContext';
import { TableInfoWrapper } from '../components/game/TableInfoWrapper';
import { InfoPill } from '../components/game/InfoPill';
import { GameUI } from '../components/game/GameUI';
import { GameStateInfo } from '../components/game/GameStateInfo';
import contentContext from '../context/content/contentContext';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ResponsiveTable } from '../components/layout/ResponsiveTable';
import { TatamiProps } from '../context/game/gameContext'
import ChipsAmountPill from '../components/game/ChipsAmountPill';



interface LocationState {
  tatamiData?: TatamiProps;
}

interface RouteParams {
  link?: string;
}

const Play: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationState>();
  const { link } = useParams<RouteParams>();
  const { socket } = useContext(socketContext);
  const { openModal } = useContext(modalContext);
  const {
    messages,
    currentTable,
    isPlayerSeated,
    seatId,
    joinTable,
    leaveTable,
    sitDown,
    standUp,
    check,
    injectDebugHand,
    playOneCard,
    showDown
  } = useContext(gameContext);
  const { getLocalizedString } = useContext(contentContext);

  const [bet, setBet] = useState(0);

  useEffect(() => {
    // Si on n'a pas de socket, on affiche la modal de déconnexion
    if (!socket) {
      openModal(() => (<Text>{getLocalizedString('game_lost-connection-modal_text')}</Text>),
        getLocalizedString('game_lost-connection-modal_header'),
        getLocalizedString('game_lost-connection-modal_btn-txt'),
        () => history.push('/'),
      );
      return;
    }

    // Si on a les données de la table dans location.state
    if (location.state?.tatamiData) {
      joinTable(location.state.tatamiData);
      return;
    }

    // Si on a un lien dans l'URL, on essaie de décoder les données de la table
    if (link) {
      try {
        const decodedData = JSON.parse(atob(link));
        const tatamiData: TatamiProps = {
          id: decodedData.id,
          name: decodedData.name,
          bet: decodedData.bet,
          isPrivate: decodedData.isPrivate,
          createdAt: new Date().toLocaleString(),
          link: link
        };
        joinTable(tatamiData);
      } catch (error) {
        console.error('Invalid table link:', error);
        history.push('/');
      }
    }

    return () => leaveTable();
    // eslint-disable-next-line
  }, [socket, location.state, link]);

  return (
    <>
      <RotateDevicePrompt />

      <Container fullHeight>
        {currentTable && (
          <>
            <PositionedUISlot
              bottom="2vh"
              left="1.5rem"
              scale="0.65"
              style={{ zIndex: '50' }}
            >
              <Button $small $secondary onClick={leaveTable}>
                {getLocalizedString('game_leave-table-btn')}
              </Button>
            </PositionedUISlot>

            {!isPlayerSeated && (
              <PositionedUISlot
                bottom="1.5vh"
                right="1.5rem"
                scale="0.65"
                style={{ pointerEvents: 'none', zIndex: '50' }}
                origin="bottom right"
              >
                <TableInfoWrapper>
                  <Text textAlign="right">
                    <strong>{currentTable.name}</strong> |{' '}

                    <strong>
                      {/* {getLocalizedString('game_info_limit-lbl')}:{' '} */}
                      Tarif/coup :
                    </strong>
                    {' '}
                    {new Intl.NumberFormat(
                      document.documentElement.lang,
                    ).format(currentTable.bet)} {' '} {'F'}
                    {' '} | {' '}

                    {/* <strong>
                      {'Statut du tatami : '}
                    </strong> */}

                    {currentTable.isPrivate ? 'Privé' : 'Ouvert'}

                    {/* <strong>
                      {'Date d\'ouverture : '}
                    </strong>

                    {currentTable.createdAt} */}
                  </Text>
                </TableInfoWrapper>
              </PositionedUISlot>
            )}
          </>
        )}

        <PokerTableWrapper>

          {/* <Button
            $small
            onClick={() => {
              injectDebugHand(seatId!);
            }}
            style={{
              position: "absolute",
              top: "-3vw",
              left: "-10vw",
            }}
          >
            Injecter des cartes
          </Button> */}

          <>
            {currentTable && (

              <ResponsiveTable>
                {/* Gauche */}
                <PositionedUISeat top="50%">
                  <Seat
                    seatNumber={'1'}
                    currentTable={currentTable}
                    isPlayerSeated={isPlayerSeated}
                    sitDown={sitDown}
                  />

                  {currentTable.seats['1'] && (
                    <PositionedUISlot
                      top="7vh"
                      left="2vw"
                    >
                      <ChipsAmountPill
                        chipsAmount={currentTable.seats['1'].bet}
                        seatPosition='1'
                      />
                    </PositionedUISlot>

                  )}
                </PositionedUISeat>

                {/* Haut */}
                <PositionedUISeat left="50%">
                  <Seat
                    seatNumber={'2'}
                    currentTable={currentTable}
                    isPlayerSeated={isPlayerSeated}
                    sitDown={sitDown}
                  />
                  <PositionedUISlot
                    top="50%"
                    right="50%"
                  >
                    {currentTable.seats['2'] && (
                      <ChipsAmountPill
                        chipsAmount={currentTable.seats['2'].bet}
                        seatPosition='2'
                      />
                    )}
                  </PositionedUISlot>

                </PositionedUISeat>

                {/* Droite */}

                <PositionedUISeat top="50%" left="100%">
                  <Seat
                    seatNumber={'3'}
                    currentTable={currentTable}
                    isPlayerSeated={isPlayerSeated}
                    sitDown={sitDown}
                  />

                  <PositionedUISlot
                    top="14vh"
                    right="14vw"
                  >
                    {currentTable.seats['3'] && (
                      <ChipsAmountPill
                        chipsAmount={currentTable.seats['3'].bet}
                        seatPosition='3'
                      />
                    )}
                  </PositionedUISlot>


                </PositionedUISeat>

                {/* Bas */}
                <PositionedUISeat left="50%" top="100%">
                  <Seat
                    seatNumber={'4'}
                    currentTable={currentTable}
                    isPlayerSeated={isPlayerSeated}
                    sitDown={sitDown}
                  />

                  <PositionedUISlot
                    bottom="42vh"
                    right="7vw"
                  >
                    {currentTable.seats['4'] && (
                      <ChipsAmountPill
                        chipsAmount={currentTable.seats['4'].bet}
                        seatPosition='4'
                      />
                    )}
                  </PositionedUISlot>

                </PositionedUISeat>
              </ResponsiveTable>
            )}

            <PositionedUISlot
              width="100%"
              origin="center center"
              scale="0.60"
              style={{
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
            </PositionedUISlot>

            <PositionedUISlot bottom="8%" scale="0.60" origin="bottom center">
              {messages && messages.length > 0 && (
                <>
                  <InfoPill>{messages[messages.length - 1]}</InfoPill>
                  {!isPlayerSeated && (
                    <InfoPill>Sit down to join the game!</InfoPill>
                  )}
                  {currentTable && currentTable.winMessages.length > 0 && (
                    <InfoPill>
                      {
                        currentTable.winMessages[
                        currentTable.winMessages.length - 1
                        ]
                      }
                    </InfoPill>
                  )}
                </>
              )}
            </PositionedUISlot>

            <PositionedUISlot
              bottom="37%"
              scale="0.60"
              origin="center center"
            >
              {currentTable && currentTable.winMessages.length === 0 && (
                <GameStateInfo currentTable={currentTable} />
              )}
            </PositionedUISlot>
          </>
        </PokerTableWrapper>

        {currentTable &&
          isPlayerSeated &&
          seatId &&
          currentTable.seats[seatId] &&
          currentTable.seats[seatId].turn && (
            <GameUI
              currentTable={currentTable}
              seatId={seatId}
              bet={bet}
              setBet={setBet}
              standUp={standUp}
              check={check}
              playOneCard={playOneCard}
              showDown={showDown}
            />
          )}
      </Container>
    </>
  );
};

export default Play;
