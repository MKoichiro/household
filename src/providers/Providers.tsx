// src/context/Providers.tsx
import { ReactNode } from 'react'
import AuthProvider from './AuthProvider'
import TransactionProvider from './TransactionProvider'
import AppProvider from './AppProvider'
import NotificationProvider from './NotificationProvider'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../theme/theme'

interface ProvidersProps {
  children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => (
  <AuthProvider>
    <TransactionProvider>
      <AppProvider>
        <NotificationProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </NotificationProvider>
      </AppProvider>
    </TransactionProvider>
  </AuthProvider>
)

export default Providers
