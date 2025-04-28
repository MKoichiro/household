import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Providers from './providers/Providers'
import NotificationPad from '../components/common/NotificationPad'
import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import GlobalErrorFallback from '../components/common/GlobalFallback'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
      <Providers>
        {/* 通知表示用ポータル */}
        <NotificationPad />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  </StrictMode>
)
