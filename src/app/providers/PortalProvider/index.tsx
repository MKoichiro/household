import type { ReactNode } from 'react'

import PortalElementProvider from './PortalElementProvider'
import PortalEntriesProvider from './PortalEntriesProvider'

const PortalProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PortalEntriesProvider>
      <PortalElementProvider>{children}</PortalElementProvider>
    </PortalEntriesProvider>
  )
}

export default PortalProvider
