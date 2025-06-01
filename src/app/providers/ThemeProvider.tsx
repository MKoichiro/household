import { ThemeProvider as MuiThemeProvider, useMediaQuery } from '@mui/material'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'

import type { ColorMode } from '@shared/hooks/useContexts'
import { ColorModeContext } from '@shared/hooks/useContexts'
import { getTheme } from '@styles/theme'

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // OS のカラーモードを取得 (初期値の判定用)
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  // OS 設定で初期化
  const [mode, setMode] = useState<ColorMode>('os')

  // ローカルストレージにデータがある場合はそれを使用
  useEffect(() => {
    const savedMode = localStorage.getItem('colorMode') as ColorMode | null
    if (savedMode && ['light', 'dark', 'os'].includes(savedMode)) {
      setMode(savedMode)
    }
  }, [])

  const value = { mode, setMode }

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
