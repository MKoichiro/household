// src/context/Providers.tsx
import { ReactNode } from 'react'
import AuthProvider from './AuthProvider'
import TransactionProvider from './TransactionProvider'
import AppProvider from './AppProvider'
import NotificationProvider from './NotificationProvider'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../../styles/theme/theme'
import GlobalStyles from '../../styles/GlobalStyles'
import PortalProvider from './PortalProvider'
import WindowSizeProvider from './WindowSizeProvider'
import LayoutProvider from './LayoutProvider'

interface ProvidersProps {
  children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => (
  <NotificationProvider>
    <AuthProvider>
      <TransactionProvider>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <CssBaseline />
          <LayoutProvider>
            <AppProvider>
              <PortalProvider>
                <WindowSizeProvider>{children}</WindowSizeProvider>
              </PortalProvider>
            </AppProvider>
          </LayoutProvider>
        </ThemeProvider>
      </TransactionProvider>
    </AuthProvider>
  </NotificationProvider>
)

export default Providers
