// src/context/Providers.tsx
import { ReactNode } from 'react'
import AuthProvider from './AuthProvider'
import TransactionProvider from './TransactionProvider'
import AppProvider from './AppProvider'
import NotificationProvider from './NotificationProvider'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../theme/theme'
import GlobalStyles from '../styles/GlobalStyles'
import PortalProvider from './PortalProvider'
import WindowSizeProvider from './WindowSizeProvider'

interface ProvidersProps {
  children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => (
  <AuthProvider>
    <TransactionProvider>
      <NotificationProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <CssBaseline />
          <AppProvider>
            <PortalProvider>
              <WindowSizeProvider>{children}</WindowSizeProvider>
            </PortalProvider>
          </AppProvider>
        </ThemeProvider>
      </NotificationProvider>
    </TransactionProvider>
  </AuthProvider>
)

export default Providers
