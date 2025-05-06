import { ReactNode } from 'react'
import PortalEntriesProvider from './PortalEntriesProvider'
import PortalElementProvider from './PortalElementProvider'

const PortalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PortalEntriesProvider>
      <PortalElementProvider>{children}</PortalElementProvider>
    </PortalEntriesProvider>
  )
}

export default PortalProvider
