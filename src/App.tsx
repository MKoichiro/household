import { ReactNode } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import AppProvider from "./context/AppContext"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { AuthProvider, useAuth } from "./context/AuthContext"
import NonAuthedLayout from "./components/layout/NonAuthedLayout"
import LandingLayout from "./components/layout/LandingLayout"
import AuthedLayout from "./components/layout/AuthedLayout"
import Home from "./pages/Home"
import Report from "./pages/Report"
import NoMatch from "./pages/NoMatch"
import SignUp from "./pages/Signup"
import Login from "./pages/Login"
import Settings from "./pages/Settings"
import Landing from "./pages/Landing"
import { theme } from "./theme/theme"
import "./config/chartConfig"

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
      <AppProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
            <Router>
              <Routes>

                {/* 公開ページ：ランディング */}
                <Route path="/" element={<LandingLayout />}>
                  <Route index element={<Landing />} />

                  {/* 存在しないページ e.g.) "/Lorem" */}
                  <Route path="*" element={<NoMatch/>} />
                </Route>

                {/* AppLayoutの中のページ */}
                <Route path="/app" element={<AuthedLayout/>}>
                  {/* Home */}
                  <Route path="home" element={
                      <RequireAuth><Home/></RequireAuth>
                  } />

                  {/* Report */}
                  <Route path="report" element={
                      <RequireAuth><Report/></RequireAuth>
                  } />

                  {/* Settings */}
                  <Route path="settings" element={
                      <RequireAuth><Settings/></RequireAuth>
                  } />
                </Route>

                {/* ログイン・登録 */}
                <Route path="/auth" element={<NonAuthedLayout/>}>
                  <Route path="login" element={<Login/>} />
                  <Route path="signup" element={<SignUp/>} />
                </Route>

              </Routes>
            </Router>
        </ThemeProvider>
      </AppProvider>
    </AuthProvider>
  )
}

export default App
