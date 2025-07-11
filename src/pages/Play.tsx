import React, { useContext, useEffect, useState } from 'react';
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
import { useHistory } from 'react-router-dom';
import { ResponsiveTable } from '../components/layout/ResponsiveTable';
import ChipsAmountPill from '../components/game/ChipsAmountPill';
import Spacer from '../components/layout/Spacer';
import globalContext from '../context/global/globalContext';
import ChatContent from '../components/game/ChatContent';
import LoadingScreen from '../components/loading/LoadingScreen';
import { JoinTableProps, Table } from '../types/SeatTypesProps';
import { Tooltip } from 'react-tooltip';
import tableContext from '../context/table/tableContext';

const Play: React.FC = () => {
  const history = useHistory();
  const { socket } = useContext(socketContext);
  const { isLoading } = useContext(globalContext);
  const { openModal, closeModal } = useContext(modalContext);
  const { isOnTable, leaveTableRequest } = useContext(tableContext);
  const {
    messages,
    currentTable,
    seatId,
    refresh,
    setRefresh,
    leaveTable,
    sitDown,
    standUp,
    joinTable,
    playOneCard,
    showDown,
    sendMessage,
    isPlayerSeated
  } = useContext(gameContext);


  const [localRefresh, setLocalRefresh] = useState(refresh);
  const { getLocalizedString, isLoading: contentIsLoading } = useContext(contentContext);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastReadTime, setLastReadTime] = useState(Date.now());
  const storedLink = localStorage.getItem("storedLink");

  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);


  useEffect(() => {
    if (isInitialized || isInitializing) return;

    const initializeTable = async () => {
      setIsInitializing(true);
      try {
        if (storedLink) {
          const decodedData = JSON.parse(atob(storedLink));
          const tableInfo: JoinTableProps = {
            id: decodedData.id,
            name: decodedData.name,
            bet: decodedData.bet,
            isPrivate: decodedData.isPrivate,
            createdAt: decodedData.createdAt,
            link: storedLink,
          };

          if (socket) {
            joinTable(tableInfo);
          } else {
            setIsInitializing(false);
            return;
          }
        }

        if (currentTable) {
          setIsInitialized(true);
          setIsInitializing(false);
        }
      } catch (error) {
        setIsInitialized(true);
        setIsInitializing(false);
      }
    };

    const timeoutId = setTimeout(() => {
      initializeTable();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [socket, storedLink, isInitialized, isInitializing, currentTable, joinTable]);

  useEffect(() => {
    if (isInitializing && !isInitialized && currentTable && storedLink) {
      setIsInitialized(true);
      setIsInitializing(false);
    }
  }, [currentTable, isInitializing, isInitialized, storedLink]);

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!socket) {
      openModal(
        () => (<Text>{getLocalizedString('game_lost-connection-modal_text')}</Text>),
        getLocalizedString('game_lost-connection-modal_header'),
        getLocalizedString('game_lost-connection-modal_btn-txt'),
        () => history.push('/'),
      );
      return;
    }

    if (!isOnTable && !storedLink) {
      history.push('/');
      return;
    }
  }, [socket, isOnTable, isInitialized, history, openModal, getLocalizedString, storedLink, currentTable]);

  useEffect(() => {
    setLocalRefresh(refresh)
  }, [refresh]);

  useEffect(() => {
    if (localRefresh) {
      closeModal();
      setTimeout(() => {
        openChatModal()
        setRefresh(false);
      }, 5)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTable?.chatRoom?.chatMessages])

  const handleSendMessage = (table: Table, seatId: string | null, message: string) => {
    sendMessage(message, seatId);
    setRefresh(true);
    if (seatId && table.seats[seatId]) {
      sitDown(table.id, seatId, table.seats[seatId].stack);
    }
  };

  const markMessagesAsRead = () => {
    setUnreadMessages(0);
    setLastReadTime(Date.now());
  };

  const openChatModal = () => {
    markMessagesAsRead();

    openModal(
      () => <ChatContent
        currentTable={currentTable}
        onSendMessage={handleSendMessage}
      />,
      'Chat room',
      'Valider',
      () => {
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input && input.value.trim() && currentTable) {
          handleSendMessage(currentTable, seatId, input.value.trim());
          input.value = '';
        }
      }
    );
  };

  const handleLeaveTable = () => {
    leaveTable();
    leaveTableRequest();
    localStorage.removeItem('socketId');
    localStorage.removeItem('storedLink');
    localStorage.removeItem("seatNumber");
    localStorage.removeItem("isPlayerSeated");
  };

  const renderGameUI = () => {
    console.log("*** renderGameUI called ***");
    console.log("currentTable:", currentTable);
    console.log("isPlayerSeated:", isPlayerSeated);
    console.log("seatId:", seatId);

    if (!currentTable || !seatId) {
      console.log("renderGameUI => returning null: missing table, or user not seated, or seatId null");
      return null;
    }

    const currentSeat = currentTable.seats?.[seatId];
    console.log("currentSeat:", currentSeat);

    if (!currentSeat) {
      console.log("renderGameUI => returning null: seat not found in currentTable.seats");
      return null;
    }

    if (!currentSeat.turn) {
      console.log("renderGameUI => returning null: seat.turn is false");
      return null;
    }

    console.log("renderGameUI => returning <GameUI /> because seat.turn is true");
    return (
      <GameUI
        currentTable={currentTable}
        seatId={seatId}
        standUp={standUp}
        playOneCard={playOneCard}
        showDown={showDown}
      />
    );
  };

  return (
    <>
      {isLoading || contentIsLoading || !isInitialized || isInitializing ? (
        <LoadingScreen />
      ) : (
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
                    <>
                      <Button
                        data-tooltip-id="leave-table-tooltip"
                        $small
                        $secondary
                        onClick={handleLeaveTable}
                      >
                        {getLocalizedString('game_leave-table-btn')}
                      </Button>
                      <Tooltip id="leave-table-tooltip" content={"Clique ici pour quitter la table"} place="top" />
                    </>

                    <>
                      <div
                        data-tooltip-id="open-chat-tooltip"
                        style={{
                          display: 'flex',
                        }}>
                        <Button
                          $small
                          $primary
                          onClick={() => openChatModal()}
                        >
                          <span style={{ color: "hsl(0, 0.00%, 100.00%)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
                              <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                            </svg>
                          </span>
                        </Button>

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
                      <Tooltip id="open-chat-tooltip" content={"Clique ici pour ouvrir le chat"} place="top" />
                    </>
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
                          Tarif/coup :
                        </strong>
                        {' '}
                        {new Intl.NumberFormat(
                          document.documentElement.lang,
                        ).format(currentTable.bet)} {' '} {'XAF'}
                        {' '} | {' '}

                        {currentTable.isPrivate ? 'Privé' : 'Ouvert'}
                      </Text>
                    </TableInfoWrapper>
                  </PositionedUISlot>
                )}
              </>
            )}

            <PokerTableWrapper>
              <>
                {currentTable && (
                  <ResponsiveTable>
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

            {renderGameUI()}
          </Container>
        </>
      )}
    </>
  );
};

export default Play;
