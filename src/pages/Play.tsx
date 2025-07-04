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
// import { TatamiProps } from '../context/game/gameContext'
import ChipsAmountPill from '../components/game/ChipsAmountPill';
import Spacer from '../components/layout/Spacer';
import globalContext from '../context/global/globalContext';
import ChatContent from '../components/game/ChatContent';
import LoadingScreen from '../components/loading/LoadingScreen';
import usePlayerSeated from '../hooks/usePlayerSeated';
import { JoinTableProps, Table } from '../types/SeatTypesProps';
import { Tooltip } from 'react-tooltip';
// import authContext from '../context/auth/authContext';
import tableContext from '../context/table/tableContext';

// interface RouteParams {
//   link?: string;
// }

const Play: React.FC = () => {
  const history = useHistory();
  // const location = useLocation<LocationState>();
  // const { link } = useParams<RouteParams>();
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
    // injectDebugHand,
    playOneCard,
    showDown,
    sendMessage,
  } = useContext(gameContext);
  const [localRefresh, setLocalRefresh] = useState(refresh);

  // Utiliser le hook personnalisé pour isPlayerSeated
  const isPlayerSeated = usePlayerSeated();
  const { getLocalizedString, isLoading: contentIsLoading } = useContext(contentContext);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastReadTime, setLastReadTime] = useState(Date.now());
  const [storedSeatId, setStoredSeatId] = useState<string | null>(localStorage.getItem("seatId"));
  const storedLink = localStorage.getItem("storedLink");

  // État pour gérer l'initialisation complète
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);


  useEffect(() => {
    // Mettre à jour storedSeatId quand il change dans le localStorage
    const handleStorageChange = () => {
      setStoredSeatId(localStorage.getItem("seatId"));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Effet pour l'initialisation
  useEffect(() => {
    console.log('🔄 [Play] Initialisation - socket:', !!socket, 'storedLink:', !!storedLink, 'isInitialized:', isInitialized, 'isInitializing:', isInitializing);

    // Ne rien faire si déjà initialisé ou en cours d'initialisation
    if (isInitialized || isInitializing) return;

    const initializeTable = async () => {
      setIsInitializing(true);
      try {
        if (storedLink) {
          console.log('🔗 [Play] Lien trouvé, décodage...');
          // Décoder le lien pour obtenir les informations de la table
          const decodedData = JSON.parse(atob(storedLink));
          const tableInfo: JoinTableProps = {
            id: decodedData.id,
            name: decodedData.name,
            bet: decodedData.bet,
            isPrivate: decodedData.isPrivate,
            createdAt: decodedData.createdAt,
            link: storedLink,
          };

          console.log('📋 [Play] Données de table décodées:', tableInfo);

          // Attendre que la socket soit disponible avec un délai plus long
          if (socket) {

            console.log("tableInfo.id", tableInfo.id);

            console.log('✅ [Play] Socket disponible, connexion à la table...');
            joinTable(tableInfo);
            console.log('✅ [Play] Connexion à la table réussie');

            if (currentTable) {
              console.log('✅ [Play] currentTable disponible');
            } else {
              console.log('⚠️ [Play] currentTable toujours indisponible après timeout');
            }
          } else {
            console.log('⏳ [Play] En attente de la socket...');
            setIsInitializing(false);
            return; // Attendre la socket
          }
        } else {
          console.log('❌ [Play] Pas de lien stocké');
        }

        // Ne marquer comme initialisé que si currentTable est disponible
        if (currentTable) {
          console.log('✅ [Play] Initialisation terminée avec currentTable');
          setIsInitialized(true);
          setIsInitializing(false);
        } else {
          console.log('⏳ [Play] Attente de currentTable avant de finaliser l\'initialisation');
          // Garder isInitializing à true pour continuer d'afficher l'écran de chargement
        }
      } catch (error) {
        console.error('❌ [Play] Erreur lors de l\'initialisation:', error);
        // En cas d'erreur, on marque quand même comme initialisé pour éviter de bloquer
        setIsInitialized(true);
        setIsInitializing(false);
      }
    };

    // Ajouter un délai initial pour laisser le temps aux contextes de s'initialiser
    const timeoutId = setTimeout(() => {
      initializeTable();
    }, 500);

    return () => clearTimeout(timeoutId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, storedLink, isInitialized, isInitializing, currentTable]);

  // Effet pour finaliser l'initialisation quand currentTable devient disponible
  useEffect(() => {
    if (isInitializing && !isInitialized && currentTable && storedLink) {
      console.log('✅ [Play] currentTable détectée, finalisation de l\'initialisation');
      setIsInitialized(true);
      setIsInitializing(false);
    }
  }, [currentTable, isInitializing, isInitialized, storedLink]);

  // Effet pour la navigation - seulement après initialisation
  useEffect(() => {
    if (!isInitialized) {
      console.log('⏳ [Play] En attente de l\'initialisation...');
      return;
    }

    console.log('🔍 [Play] Vérification navigation - socket:', !!socket, 'isOnTable:', isOnTable, 'storedLink:', !!storedLink, 'currentTable:', !!currentTable);

    // Délai plus long pour laisser le temps aux contextes de se mettre à jour
    const timeoutId = setTimeout(() => {
      if (!socket) {
        console.log('❌ [Play] Pas de socket après initialisation, redirection...');
        openModal(
          () => (<Text>{getLocalizedString('game_lost-connection-modal_text')}</Text>),
          getLocalizedString('game_lost-connection-modal_header'),
          getLocalizedString('game_lost-connection-modal_btn-txt'),
          () => history.push('/'),
        );
        return;
      }

      if (!isOnTable && !storedLink) {
        console.log('❌ [Play] Pas connecté à une table et pas de lien, redirection vers MainPage...');
        history.push('/');
        return;
      }

      // Vérifier si currentTable est disponible
      if (storedLink && !currentTable) {
        console.log('⚠️ [Play] Lien présent mais currentTable manquante, attente...');
        // Ne pas rediriger, laisser plus de temps
        return;
      }

      console.log('✅ [Play] Vérifications de navigation réussies');
    }, 500); // Augmenter le délai à 500ms

    return () => clearTimeout(timeoutId);
  }, [socket, isOnTable, isInitialized, history, openModal, getLocalizedString, storedLink, currentTable]);

  useEffect(() => {
    setLocalRefresh(refresh)
  }, [refresh])

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
    // Envoyer le message même si le joueur n'est pas assis
    sendMessage(message, seatId);

    // Déclencher le refresh pour mettre à jour l'affichage
    setRefresh(true);

    // Ne faire le sitDown que si le joueur est assis
    if (seatId && table.seats[seatId]) {
      sitDown(table.id, seatId, table.seats[seatId].stack);
    }
  };

  const markMessagesAsRead = () => {
    setUnreadMessages(0);
    setLastReadTime(Date.now());
  };

  const openChatModal = () => {

    // Marquer les messages comme lus quand on ouvre la modal
    markMessagesAsRead();

    openModal(
      () => <ChatContent
        currentTable={currentTable}
        onSendMessage={handleSendMessage}
      />,
      'Chat room',
      'Valider',
      () => {
        // Récupérer la valeur de l'input et envoyer le message
        const input = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (input && input.value.trim() && currentTable) {
          handleSendMessage(currentTable, storedSeatId, input.value.trim());
          input.value = '';
        }
      }
    );
  };

  return (
    <>
      {isLoading || contentIsLoading || !isInitialized || isInitializing ? (
        <>
          <LoadingScreen />
          {isInitializing && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textAlign: 'center',
              zIndex: 1000
            }}>
              <Text>Reconnexion à la table en cours...</Text>
            </div>
          )}
        </>
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
                      <Button data-tooltip-id="leave-table-tooltip" $small $secondary onClick={() => {
                        console.log('🚪 [Play] Bouton quitter table cliqué - nettoyage localStorage');
                        console.log('🔍 [Play] localStorage avant nettoyage:', {
                          seatId: localStorage.getItem('seatId'),
                          isPlayerSeated: localStorage.getItem('isPlayerSeated'),
                          storedLink: localStorage.getItem('storedLink')
                        });

                        leaveTable();
                        leaveTableRequest(); // Mettre à jour l'état de table
                        // Supprimer le socketId et le storedLink du localStorage
                        localStorage.removeItem('socketId');
                        localStorage.removeItem('storedLink');
                        localStorage.removeItem("seatId");
                        localStorage.removeItem("isPlayerSeated");

                        console.log('🧹 [Play] localStorage après nettoyage:', {
                          seatId: localStorage.getItem('seatId'),
                          isPlayerSeated: localStorage.getItem('isPlayerSeated'),
                          storedLink: localStorage.getItem('storedLink')
                        });
                      }}>
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
                          {/* {getLocalizedString('game_info_limit-lbl')}:{' '} */}
                          Tarif/coup :
                        </strong>
                        {' '}
                        {new Intl.NumberFormat(
                          document.documentElement.lang,
                        ).format(currentTable.bet)} {' '} {'XAF'}
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
                  standUp={standUp}
                  playOneCard={playOneCard}
                  showDown={showDown}
                />
              )}
          </Container>
        </>
      )}
    </>
  );
};

export default Play;