// src/app/providers/ThemeProvider.tsx
import { ReactNode, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material'
import { getTheme } from '../../styles/theme'
import { ColorMode, ColorModeContext } from '../../shared/hooks/useContexts'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // OS のカラーモードを取得 (初期値の判定用)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // 初期値を OS 設定に合わせる
  const [mode, setMode] = useState<ColorMode>('os')

  const value = {
    setMode,
    mode,
  }

  // モード依存でテーマを生成
  const theme = useMemo(
    () => getTheme(mode === 'os' ? (prefersDarkMode ? 'dark' : 'light') : mode),
    [mode, prefersDarkMode]
  )

  return (
    <ColorModeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default ThemeProvider
