import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Report from "./pages/Report"
import NoMatch from "./pages/NoMatch"
import AppLayout from "./components/layout/AppLayout"
import { ThemeProvider, CssBaseline } from "@mui/material"
import { theme } from "./theme/theme"
import "./config/chartConfig"
import AppProvider from "./context/AppContext"

function App() {

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <Router>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index
                  element={
                    <Home />
                  }
                />

                <Route
                  path="/report"
                  element={
                    <Report />
                  }
                />

                <Route path="*" element={<NoMatch />} />
              </Route>
            </Routes>
          </Router>
      </ThemeProvider>
    </AppProvider>
  )
}

export default App
