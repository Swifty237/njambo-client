import React from 'react';
import GlobalState from './global/GlobalState';
import AuthProvider from './auth/AuthProvider';
import LocaProvider from './localization/LocaProvider';
import ContentProvider from './content/ContentProvider';
import ModalProvider from './modal/ModalProvider';
import { ThemeProvider } from 'styled-components';
import theme from '../styles/theme';
import Normalize from '../styles/Normalize';
import GlobalStyles from '../styles/Global';
import { useLocation } from 'react-router-dom';
import OfflineProvider from './offline/OfflineProvider';
import WebSocketProvider from './websocket/WebsocketProvider';
import GameState from './game/GameState';
import ResizeObserverProvider from '../utils/ResizeObserverProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  const location = useLocation();

  return (
    <ResizeObserverProvider>
      <ThemeProvider theme={theme}>
        <GlobalState>
          <LocaProvider location={location}>
            <ContentProvider>
              <AuthProvider>
                <ModalProvider>
                  <OfflineProvider>
                    <WebSocketProvider>
                      <GameState>
                        <Normalize />
                        <GlobalStyles />
                        {children}
                      </GameState>
                    </WebSocketProvider>
                  </OfflineProvider>
                </ModalProvider>
              </AuthProvider>
            </ContentProvider>
          </LocaProvider>
        </GlobalState>
      </ThemeProvider>
    </ResizeObserverProvider>
  );
};

export default Providers;
