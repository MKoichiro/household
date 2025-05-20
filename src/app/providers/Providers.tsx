import { ReactNode } from 'react'
import AuthProvider from './AuthProvider'
import NotificationProvider from './NotificationProvider'
import { CssBaseline } from '@mui/material'
import GlobalStyles from '../../styles/GlobalStyles'
import PortalProvider from './PortalProvider'
import LayoutProvider from './LayoutProvider'
import ThemeProvider from './ThemeProvider'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <NotificationProvider>
      <ThemeProvider>
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
}

export default Providers
