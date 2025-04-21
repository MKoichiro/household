import { ReactNode, useLayoutEffect, useState } from 'react'
import { Breakpoint, useTheme } from '@mui/material'
import { WindowSizeContext } from '../../shared/hooks/useContexts'
import { debounce } from '../../shared/utils/debounce' // あなたのユーティリティへのパスに合わせてください

type Matches = Record<Breakpoint, boolean>

// 「サーバー上でエラーなく動き、CSR 時に正しく幅を拾って更新される」
const WindowSizeProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme()
  const keys = Object.keys(theme.breakpoints.values) as Breakpoint[]

  const [width, setWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : theme.breakpoints.values.md
  )

  useLayoutEffect(() => {
    // デバウンス付きリサイズハンドラを作成
    const handleResize = debounce(() => {
      setWidth(window.innerWidth)
    }, 100)

    // マウント時にも一度呼び出して初期値を確定
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      handleResize.cancel() // 残余タイマーをクリア
    }
  }, [])

  const matchesDown: Matches = keys.reduce((acc, key) => {
    acc[key] = width < theme.breakpoints.values[key]
    return acc
  }, {} as Matches)

  const matchesUp: Matches = keys.reduce((acc, key) => {
    acc[key] = width >= theme.breakpoints.values[key]
    return acc
  }, {} as Matches)

  const down = (key: Breakpoint) => matchesDown[key]
  const up = (key: Breakpoint) => matchesUp[key]
  const between = (min: Breakpoint, max: Breakpoint) => up(min) && down(max)

  return <WindowSizeContext.Provider value={{ down, up, between }}>{children}</WindowSizeContext.Provider>
}

export default WindowSizeProvider
