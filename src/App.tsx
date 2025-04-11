import { lazy, ReactNode, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppProvider from './context/AppContext'
import { ThemeProvider, CssBaseline } from '@mui/material'
import AuthProvider from './context/AuthContext'
import NonAuthedLayout from './components/layout/NonAuthedLayout'
import LandingLayout from './components/layout/LandingLayout'
import AuthedLayout from './components/layout/AuthedLayout'
import NoMatch from './pages/NoMatch'
import SignUp from './pages/Signup'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Landing from './pages/Landing'
import { theme } from './theme/theme'
import './config/chartConfig'
import TransactionProvider from './context/TransactionContext'
import LoadingOverlay from './components/common/LoadingOverlay'
import { useAuth } from './hooks/useContexts'

// 比較的大きなコンポーネントは、React.lazyで遅延読み込み
const Home = lazy(() => import('./pages/Home'))
const Report = lazy(() => import('./pages/Report'))

const CheckAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  // ログイン済みの場合はHomeページへリダイレクト
  if (user) {
    return <Navigate to="/app/home" replace />
  }

  // 未ログインならSignupまたはLoginページを表示
  return children
}

// 認証ガード
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  // 未ログインの場合はログインページへリダイレクト
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  // ログイン済なら子コンポーネント（保護されたページ）を表示
  return children
}

const App = () => {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AppProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <Routes>
                {/* 公開ページ：ランディング */}
                <Route path="/" element={<LandingLayout />}>
                  <Route
                    index
                    element={
                      <CheckAuth>
                        <Landing />
                      </CheckAuth>
                    }
                  />

                  {/* 存在しないページ e.g.) "/Lorem" */}
                  <Route path="*" element={<NoMatch />} />
                </Route>

                {/* AppLayoutの中のページ */}
                <Route
                  path="/app"
                  element={
                    <RequireAuth>
                      <AuthedLayout />
                    </RequireAuth>
                  }
                >
                  <Route
                    path="home"
                    element={
                      <Suspense fallback={<LoadingOverlay isLoading />}>
                        <Home />
                      </Suspense>
                    }
                  />
                  <Route
                    path="report"
                    element={
                      <Suspense fallback={<LoadingOverlay isLoading />}>
                        <Report />
                      </Suspense>
                    }
                  />

                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NoMatch />} />
                </Route>

                {/* ログイン・登録 */}
                <Route
                  path="/auth"
                  element={
                    <CheckAuth>
                      <NonAuthedLayout />
                    </CheckAuth>
                  }
                >
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<SignUp />} />
                  <Route path="*" element={<NoMatch />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ThemeProvider>
        </AppProvider>
      </TransactionProvider>
    </AuthProvider>
  )
}

export default App
