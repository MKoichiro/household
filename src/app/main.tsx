import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import GlobalErrorFallback from '@ui/fallback/GlobalFallback'
import NotificationPad from '@ui/NotificationPad/NotificationPad'

import App from './App'
import Providers from './providers'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 最後の砦、適切な粒度で ComponentFallback でラップするように */}
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <Providers>
        {/* 通知表示用ポータル */}
        <NotificationPad />
        <App />
      </Providers>
    </ErrorBoundary>
  </StrictMode>
)
