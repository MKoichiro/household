import { ReactNode } from 'react'
import AuthProvider from './AuthProvider'
import NotificationProvider from './NotificationProvider'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { theme } from '../../styles/theme/theme'
import GlobalStyles from '../../styles/GlobalStyles'
import PortalProvider from './PortalProvider'
import LayoutProvider from './LayoutProvider'

interface ProvidersProps {
  children: ReactNode
}

const Providers = ({ children }: ProvidersProps) => (
  <NotificationProvider>
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <CssBaseline />
      <LayoutProvider>
        <PortalProvider>
          <AuthProvider>{children}</AuthProvider>
        </PortalProvider>
      </LayoutProvider>
    </ThemeProvider>
  </NotificationProvider>
)

export default Providers
