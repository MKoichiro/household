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

// 比較的大きなコンポーネントは、React.lazyで遅延読み込み
const Home = lazy(() => import('./pages/Home'))
const Report = lazy(() => import('./pages/Report'))

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

// 認証済みはHomeページへリダイレクトするガード
const CheckAuth = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()

  // ログイン済みの場合はHomeページへリダイレクト
  if (user) {
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

            <Route path="settings">
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

          {/* コンポーネントテスト用キャンバスページ */}
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
