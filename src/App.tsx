import { lazy, ReactNode, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NonAuthedLayout from './components/layouts/NonAuthedLayout'
import LandingLayout from './components/layouts/LandingLayout'
import AuthedLayout from './components/layouts/AuthedLayout'
import NoMatch from './pages/NoMatch'
import SignUp from './pages/Signup'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Landing from './pages/Landing'
import './configs/chartConfig'
import LoadingOverlay from './components/common/LoadingOverlay'
import { useAuth } from './hooks/useContexts'
import Providers from './providers/Providers'
import TestAccordionSingle from './components/dev/TestAccordionSingle'
import TestAccordionMultiple from './components/dev/TestAccordionMultiple'
import Security from './pages/Security'
import SettingsLayout from './components/layouts/SettingsLayout'
import VerifyEmail from './pages/VerifyEmail'
import Notification from './components/common/Notification'

// 比較的大きなコンポーネントは、React.lazyで遅延読み込み
const Home = lazy(() => import('./pages/Home'))
const Report = lazy(() => import('./pages/Report'))

const RequireEmailVerification = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  // メール未確認の場合はメール確認ページへリダイレクト
  if (user && !user.emailVerified) {
    return <Navigate to="/verify-email" replace />
  }

  // メール確認済み、ログイン済みユーザーのみ子コンポーネント（保護されたページ）を表示
  return children
}

// 認証ガード
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  // 未ログインの場合はログインページへリダイレクト
  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  // メール確認済み、ログイン済みユーザーのみ子コンポーネント（保護されたページ）を表示
  return children
}

// 認証済みはHomeページへリダイレクトするガード
const CheckAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  // ログイン済みの場合はHomeページへリダイレクト
  if (user && user.emailVerified) {
    return <Navigate to="/app/home" replace />
  }

  // 未ログインならSignupまたはLoginページを表示
  return children
}

const CheckDev = ({ children }: { children: ReactNode }) => {
  // 環境変数で開発環境かどうかを判定
  const isDev = import.meta.env.MODE === 'development'

  // 本番環境ならNotFoundへリダイレクト
  if (!isDev) {
    return <Navigate to="/404" replace />
  }
  // 開発環境なら子コンポーネントを表示
  return children
}

const App = () => {
  return (
    <Providers>
      {/* 通知表示用コンポーネント */}
      {/* Routerの外に配置することで、ページ遷移に影響されず、通知を表示できる */}
      <Notification />
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
              // layoutに認証ガードを付けることで、home, report, settingsの3ページを保護
              <RequireAuth>
                <RequireEmailVerification>
                  <AuthedLayout />
                </RequireEmailVerification>
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

            <Route path="settings" element={<SettingsLayout />}>
              <Route path="basic" element={<Settings />} />
              <Route path="security" element={<Security />} />
            </Route>

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

          {/* メール確認ページ */}
          <Route
            path="/verify-email"
            element={
              <CheckAuth>
                <RequireAuth>
                  <NonAuthedLayout />
                </RequireAuth>
              </CheckAuth>
            }
          >
            <Route index element={<VerifyEmail />} />
          </Route>

          {/* 開発環境: コンポーネントテスト用キャンバスページ */}
          <Route
            path="/test"
            element={
              <CheckDev>
                <AuthedLayout />
              </CheckDev>
            }
          >
            <Route
              path="canvas1"
              element={
                <Suspense fallback={<LoadingOverlay isLoading />}>
                  {/* ここで確認したいコンポーネントを読み込む */}
                  <TestAccordionSingle />
                  <TestAccordionMultiple />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  )
}

export default App
