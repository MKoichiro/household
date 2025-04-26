// アプリケーションのレイアウトに関する状態を管理するプロバイダー
import { ReactNode, useCallback, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { headerMainHeight, headerNewsHeight } from '../../shared/constants/ui'
import { LayoutContext } from '../../shared/hooks/useContexts'

const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const isDownLaptop = useMediaQuery((theme) => theme.breakpoints.down('lg'))
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(isDownLaptop ? false : true)
  const [isNewsOpen, setIsNewsOpen] = useState(false)

  // useLayoutEffect の依存配列に含めるので参照を安定化。
  // see: .src/components/layouts/AuthedHeader.tsx
  const handleNewsOpen = useCallback(() => {
    setIsNewsOpen(true)
  }, [])

  const handleNewsClose = () => setIsNewsOpen(false)

  // isNewsOpenが参照不要なコンポーネントで、引数不要で直接取得するための関数
  const dynamicHeaderHeight = () => (isNewsOpen ? headerMainHeight + headerNewsHeight : headerMainHeight)

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
