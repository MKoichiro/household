// アプリケーションのレイアウトに関する状態を管理するプロバイダー
import { CSSProperties, ReactNode, useCallback, useState } from 'react'
import { useTheme } from '@mui/material'
import { LayoutContext } from '../../shared/hooks/useContexts'
import { useBreakpoint } from '../../shared/hooks/useBreakpoint'

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const theme = useTheme()
  const { bp } = useBreakpoint()
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(false)
  const [isNewsOpen, setIsNewsOpen] = useState(false)

  // useLayoutEffect の依存配列に含めるので参照を安定化。
  // see: .src/components/layouts/AuthedHeader.tsx
  const handleNewsOpen = useCallback(() => setIsNewsOpen(true), [])

  const handleNewsClose = () => setIsNewsOpen(false)

  // isNewsOpen が参照不要なコンポーネントで、引数不要で直接取得するための値
  const dynamicHeaderHeight: CSSProperties['height'] = isNewsOpen
    ? `calc(${theme.height.header[bp]} + ${theme.height.headerNews[bp]})`
    : theme.height.header[bp]

  const value = {
    dynamicHeaderHeight,
    isNewsOpen,
    isNavigationMenuOpen,
    handleNewsOpen,
    handleNewsClose,
    setIsNavigationMenuOpen,
  }

  return <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
}

export default LayoutProvider
