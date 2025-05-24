import NavigationMenu from './NavigationMenu'
import { headerMainHeight } from '../../../shared/constants/ui'
import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'
import AuthedHeader from './AuthedHeader'
import { useLayout } from '../../../shared/hooks/useContexts'
import LayoutRoot from '../common/LayoutRoot'

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
  margin-left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.lg : '0')};
  transition: margin-left 300ms ease;
  min-height: calc(100lvh - ${headerMainHeight}px);
`
