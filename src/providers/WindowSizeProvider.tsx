import { ReactNode, useEffect, useState } from 'react'
import { useTheme } from '@emotion/react'
import { Breakpoint } from '@mui/material'
import { WindowSizeContext } from '../hooks/useContexts'

const WindowSizeProvider = ({ children }: { children: ReactNode }) => {
  // MUI の theme を取得, query文字列生成のために使う
  const theme = useTheme()
  // theme.breakpoints.values のキー一覧
  const keys = Object.keys(theme.breakpoints.values) as Breakpoint[] // ['xs', 'sm', 'md', 'lg', 'xl']

  // matchesDown / matchesUp: 各ブレイクポイント以下／以上かどうかを保持するステート
  // 初期値は全キー false
  const [matchesDown, setMatchesDown] = useState<Record<Breakpoint, boolean>>(
    () => Object.fromEntries(keys.map((k) => [k, false])) as Record<Breakpoint, boolean> // { xs: false, sm: false, md: false, lg: false, xl: false }
  )
  const [matchesUp, setMatchesUp] = useState<Record<Breakpoint, boolean>>(
    () => Object.fromEntries(keys.map((k) => [k, false])) as Record<Breakpoint, boolean>
  )

  useEffect(() => {
    // SSR 環境や matchMedia 未対応ブラウザでは何もしない
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return

    // クリーンアップ関数を保存する配列を用意
    const cleanupFunctions: Array<() => void> = []

    keys.forEach((key) => {
      // (max-width: ...) / (min-width: ...) のメディアクエリ文字列を生成
      const downQuery = theme.breakpoints.down(key) // 例: '(max-width: 600px)'
      const upQuery = theme.breakpoints.up(key) // 例: '(min-width: 600px)'
      // matchMedia で MediaQueryList を作成
      const mqlDown: MediaQueryList = window.matchMedia(downQuery)
      const mqlUp: MediaQueryList = window.matchMedia(upQuery)

      // 初回マッチ結果を取得し、ステートを更新
      setMatchesDown((prev) => ({ ...prev, [key]: mqlDown.matches }))
      setMatchesUp((prev) => ({ ...prev, [key]: mqlUp.matches }))

      // マッチ状態変化時のハンドラ
      const handleDown = (e: MediaQueryListEvent) => setMatchesDown((prev) => ({ ...prev, [key]: e.matches }))
      const handleUp = (e: MediaQueryListEvent) => setMatchesUp((prev) => ({ ...prev, [key]: e.matches }))

      // onchange プロパティを使ってリスナを設定
      mqlDown.onchange = handleDown
      mqlUp.onchange = handleUp
      // クリーンアップ用に onchange を解除
      cleanupFunctions.push(() => (mqlDown.onchange = null))
      cleanupFunctions.push(() => (mqlUp.onchange = null))
    })

    // エフェクトのクリーンアップで登録したリスナを削除
    return () => cleanupFunctions.forEach((fn) => fn())
  }, [theme]) // theme の参照は基本的に変わらないので実効的には初回のみ実行される

  // 判定関数
  const down = (key: Breakpoint) => Boolean(matchesDown[key])
  const up = (key: Breakpoint) => Boolean(matchesUp[key])
  const between = (min: Breakpoint, max: Breakpoint) => up(min) && down(max)

  const value = {
    down,
    up,
    between,
  }

  return <WindowSizeContext.Provider value={value}>{children}</WindowSizeContext.Provider>
}

export default WindowSizeProvider
