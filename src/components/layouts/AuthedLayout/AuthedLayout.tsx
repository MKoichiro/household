import styled from '@emotion/styled'
import { Outlet } from 'react-router-dom'

import LayoutRoot from '@layouts/common/LayoutRoot'
import { useLayout } from '@shared/hooks/useContexts'

import AuthedHeader from './AuthedHeader'
import NavigationMenu from './NavigationMenu'

const AuthedLayout = () => {
  const { isNavigationMenuOpen, setIsNavigationMenuOpen } = useLayout()

  const handleMenuClose = () => setIsNavigationMenuOpen(false)
  const handleMenuToggle = () => setIsNavigationMenuOpen((prev) => !prev)

  return (
    <LayoutRoot>
      <div style={{ position: 'relative' }}>
        {/* ヘッダー */}
        <AuthedHeader onMenuToggleClick={handleMenuToggle} isNavigationMenuOpen={isNavigationMenuOpen} />

        {/* サイドバー */}
        <NavigationMenu isOpen={isNavigationMenuOpen} onClose={handleMenuClose} />

        {/* メインコンテンツ */}
        <Main $isNavigationMenuOpen={isNavigationMenuOpen}>
          <Outlet />
        </Main>
      </div>
    </LayoutRoot>
  )
}

export default AuthedLayout

const Main = styled.main<{ $isNavigationMenuOpen: boolean }>`
  margin-left: 0;
  transition: margin-left 300ms;
  min-height: calc(100lvh - ${({ theme }) => theme.height.header.xs});

  ${({ theme }) => theme.breakpoints.up('sm')} {
    min-height: calc(100lvh - ${({ theme }) => theme.height.header.sm});
  }
  ${({ theme }) => theme.breakpoints.up('md')} {
    margin-left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.md : '0')};
    min-height: calc(100lvh - ${({ theme }) => theme.height.header.md});
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    margin-left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.lg : '0')};
    min-height: calc(100lvh - ${({ theme }) => theme.height.header.lg});
  }
  ${({ theme }) => theme.breakpoints.up('xl')} {
    margin-left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.xl : '0')};
    min-height: calc(100lvh - ${({ theme }) => theme.height.header.xl});
  }
`
