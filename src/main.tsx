import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext.tsx';
import { UsersProvider } from './contexts/UsersContext.tsx';
import { NotificationsProvider } from './contexts/NotificationsContext.tsx';
import { MessagesProvider } from './contexts/MessagesContext.tsx';
import { FeedProvider } from './contexts/FeedContext.tsx';
import { SupervisorsProvider } from './contexts/SupervisorsContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <FeedProvider>
        <UsersProvider>
          <AuthProvider>
            <SiteSettingsProvider>
              <SupervisorsProvider>
                <NotificationsProvider>
                  <MessagesProvider>
                    <App />
                  </MessagesProvider>
                </NotificationsProvider>
              </SupervisorsProvider>
            </SiteSettingsProvider>
          </AuthProvider>
        </UsersProvider>
      </FeedProvider>
    </BrowserRouter>
  </StrictMode>,
);
