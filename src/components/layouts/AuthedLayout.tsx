// src/components/layout/AuthedLayout.tsx
import Box from '@mui/material/Box'
import NavigationMenu from '../common/NavigationMenu'
import { footerHeight, headerMainHeight, navigationMenuWidth } from '../../shared/constants/ui'
import { Outlet } from 'react-router-dom'
import styled from '@emotion/styled'
import AuthedHeader from './AuthedHeader'
import { useLayout } from '../../shared/hooks/useContexts'

const AuthedLayout = () => {
  const { isNavigationMenuOpen, setIsNavigationMenuOpen } = useLayout()

  const handleMenuClose = () => setIsNavigationMenuOpen(false)
  const handleMenuToggle = () => setIsNavigationMenuOpen((prev) => !prev)

  return (
    <Box sx={{ bgcolor: (theme) => theme.palette.grey[100], position: 'relative', minHeight: '100lvh' }}>
      {/* ヘッダー */}
      <AuthedHeader onMenuToggleClick={handleMenuToggle} isNavigationMenuOpen={isNavigationMenuOpen} />

      {/* サイドバー */}
      <NavigationMenu isOpen={isNavigationMenuOpen} onClose={handleMenuClose} />

      {/* メインコンテンツ */}
      <Main $isNavigationMenuOpen={isNavigationMenuOpen}>
        <Outlet />
      </Main>

      <footer style={{ minHeight: `${footerHeight}px` }}>Footer 未実装</footer>
    </Box>
  )
}

export default AuthedLayout

const Main = styled.main<{ $isNavigationMenuOpen: boolean }>`
  margin-left: ${({ $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0')};
  transition: margin-left 300ms ease;
  min-height: calc(100lvh - ${headerMainHeight}px);

  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-left: 0;
  }
`
