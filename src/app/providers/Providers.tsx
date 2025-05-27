import { CssBaseline } from '@mui/material'
import type { ReactNode } from 'react'

import GlobalStyles from '@styles/GlobalStyles'

import AuthProvider from './AuthProvider'
import LayoutProvider from './LayoutProvider'
import NotificationProvider from './NotificationProvider'
import PortalProvider from './PortalProvider'
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
