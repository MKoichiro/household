import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Providers from './providers/Providers'
import NotificationPad from '../components/common/NotificationPad/NotificationPad'
import { ErrorBoundary } from 'react-error-boundary'
import GlobalErrorFallback from '../components/common/fallback/GlobalFallback'

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
