import React, { useContext, useEffect, useState, ChangeEvent, useRef } from 'react';
import Container from '../components/layout/Container';
import Button from '../components/buttons/Button';
import gameContext from '../context/game/gameContext';
import socketContext from '../context/websocket/socketContext';
import { RotateDevicePrompt } from '../components/game/RotateDevicePrompt';
import { PositionedUISlot } from '../components/game/PositionedUISlot';
import { PositionedUISeat } from '../components/game/PositionedUISeat';
import { PokerTableWrapper } from '../components/game/PokerTableWrapper';
import { Seat } from '../components/game/Seat';
import Text from '../components/typography/Text';
import modalContext from '../context/modal/modalContext';
import { TableInfoWrapper } from '../components/game/TableInfoWrapper';
import { InfoPill } from '../components/game/InfoPill';
import { AutoHideInfoPill } from '../components/game/AutoHideInfoPill';
import { GameUI } from '../components/game/GameUI';
import { GameStateInfo } from '../components/game/GameStateInfo';
import contentContext from '../context/content/contentContext';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ResponsiveTable } from '../components/layout/ResponsiveTable';
import { TatamiProps } from '../context/game/gameContext'
import ChipsAmountPill from '../components/game/ChipsAmountPill';
import Spacer from '../components/layout/Spacer';
import globalContext from '../context/global/globalContext';
import ChatContent from '../components/game/ChatContent';


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
  const { userName } = useContext(globalContext);
  const { openModal, closeModal } = useContext(modalContext);
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
    // injectDebugHand,
    playOneCard,
    showDown,
    sendMessage
  } = useContext(gameContext);
  const { getLocalizedString } = useContext(contentContext);

  const [bet, setBet] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastReadTime, setLastReadTime] = useState(Date.now());
  const [count, setCount] = useState(0);

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

  useEffect(() => {
    console.log("chatMessages :", currentTable?.chatRoom?.chatMessages);
    if (count > 0) {
      closeModal();
      setTimeout(() => {
        openChatModal()
      }, 5)
    } else {
      setCount(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTable?.chatRoom?.chatMessages])

  const handleSendMessage = (message: string) => {
    if (!seatId) {
      console.log("Erreur: seatId manquant");
      return;
    }
    console.log("handleSendMessage appelé avec:", { message, seatId });
    sendMessage(message, seatId);
  };

  const markMessagesAsRead = () => {
    setUnreadMessages(0);
    setLastReadTime(Date.now());
  };

  const openChatModal = () => {
    if (!isPlayerSeated) {
      console.log("L'utilisateur n'est pas assis");
      return;
    }

    // Marquer les messages comme lus quand on ouvre la modal
    markMessagesAsRead();

    openModal(
      () => <ChatContent
        messages={currentTable?.chatRoom?.chatMessages || []}
        onSendMessage={handleSendMessage}
        currentTable={currentTable}
      />,
      'Chat room',
      'Valider',
      () => {
        // Récupérer la valeur de l'input et envoyer le message
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input && input.value.trim()) {
          handleSendMessage(input.value.trim());
          input.value = '';
        }
      }
    );
  };

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
              <Spacer>
                <Button $small $secondary onClick={leaveTable}>
                  {getLocalizedString('game_leave-table-btn')}
                </Button>

                <div style={{
                  display: 'flex',
                }}>
                  <div
                    style={{
                      cursor: "pointer"
                    }}
                    onClick={() => openChatModal()}
                  >
                    <span style={{ color: "hsl(162, 100%, 28%)" }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
                        <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                      </svg>
                    </span>
                  </div>

                  {unreadMessages > 0 && (
                    <div
                      style={{
                        color: 'white',
                        background: 'hsl(0, 100%, 46%)',
                        width: '20px',
                        height: '20px',
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '-10px',
                      }}
                    >
                      <span style={{ padding: '2px' }}>{unreadMessages}</span>
                    </div>
                  )}
                </div>
              </Spacer>
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

                  {currentTable.seats && currentTable.seats['1'] && (
                    <PositionedUISlot
                      top="7vh"
                      left="1vw"
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
                    top="7vh"
                    right="14vw"
                  >
                    {currentTable.seats && currentTable.seats['2'] && (
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
                    bottom="33vh"
                    right="16vw"
                  >
                    {currentTable.seats && currentTable.seats['3'] && (
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
                    bottom="35vh"
                    left="5vw"
                  >
                    {currentTable.seats && currentTable.seats['4'] && (
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
              {messages?.length > 0 && (
                <>
                  <AutoHideInfoPill autoHide>
                    {messages[messages.length - 1]}
                  </AutoHideInfoPill>
                  {!isPlayerSeated && (
                    <InfoPill>Sit down to join the game!</InfoPill>
                  )}
                  {currentTable?.winMessages && currentTable.winMessages.length > 0 && (
                    <AutoHideInfoPill autoHide>
                      {currentTable.winMessages[currentTable.winMessages.length - 1] || ''}
                    </AutoHideInfoPill>
                  )}
                </>
              )}
            </PositionedUISlot>

            <PositionedUISlot
              bottom="37%"
              scale="0.60"
              origin="center center"
            >
              {currentTable && currentTable.winMessages && currentTable.winMessages.length === 0 && (
                <GameStateInfo currentTable={currentTable} />
              )}
            </PositionedUISlot>
          </>
        </PokerTableWrapper>

        {currentTable &&
          isPlayerSeated &&
          seatId &&
          currentTable.seats &&
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
