// src/components/layout/AuthedLayout.tsx
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import NavigationMenu from '../common/NavigationMenu'
import LogoutIcon from '@mui/icons-material/Logout'
import { footerHeight, headerHeight, navigationMenuWidth } from '../../constants/ui'
import HeaderTitle from '../common/HeaderTitle'
import { Button } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { useApp, useAuth, useNotifications } from '../../hooks/useContexts'
import styled from '@emotion/styled'

const Header = styled.header<{ $isNavigationMenuOpen: boolean; $isDownLaptop: boolean }>`
  background-color: ${({ theme }) => theme.palette.header.main};
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  position: fixed;
  top: 0;
  left: ${({ $isNavigationMenuOpen, $isDownLaptop }) => {
    if ($isDownLaptop) return '0'
    return $isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0'
  }};
  z-index: ${({ theme, $isDownLaptop }) => ($isDownLaptop ? theme.zIndex.header.md : theme.zIndex.header.lg)};
  width: ${({ $isNavigationMenuOpen, $isDownLaptop }) => {
    if ($isDownLaptop) return '100%'
    return `calc(100% - ${$isNavigationMenuOpen ? navigationMenuWidth : 0}px)`
  }};
  height: ${headerHeight}px;
  transition:
    left 0.3s ease,
    width 0.3s ease;
`

const Main = styled.main<{ $isDownLaptop: boolean; $isNavigationMenuOpen: boolean }>`
  display: flex;
  margin-top: ${headerHeight}px;
  margin-left: ${({ $isNavigationMenuOpen, $isDownLaptop }) => {
    if ($isDownLaptop) {
      return '0'
    }
    return $isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0'
  }};
  transition: margin-left 0.3s ease;
`

const AuthedLayout = () => {
  const { isNavigationMenuOpen, setIsNavigationMenuOpen, isDownLaptop } = useApp()
  const { handleLogout } = useAuth()
  const { addNotification } = useNotifications()

  const handleNavigationMenuClose = () => setIsNavigationMenuOpen(false)
  const handleNavigationMenuToggle = () => setIsNavigationMenuOpen((prev) => !prev)

  const handleLogoutClick = () => {
    handleLogout()
      .then(() => {
        // リダイレクト処理はRequireAuthガードコンポーネントが行う
        addNotification({
          severity: 'success',
          message: 'ログアウトしました。',
          timer: 3000,
        })
      })
      .catch((error) => {
        console.error('Logout failed:', error)
        addNotification({
          severity: 'error',
          message: '内部エラーによりログアウトに失敗しました。時間をおいて再度お試しください。',
        })
      })
  }

  const navigate = useNavigate()

  return (
    <Box sx={{ bgcolor: (theme) => theme.palette.grey[100], position: 'relative', minHeight: '100lvh' }}>
      {/* ヘッダー */}
      <Header $isNavigationMenuOpen={isNavigationMenuOpen} $isDownLaptop={isDownLaptop}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleNavigationMenuToggle}
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ cursor: 'pointer' }} onClick={() => void navigate('/app/home', { replace: true })}>
          <HeaderTitle />
        </Box>

        <Button
          variant="outlined"
          aria-label="log out"
          sx={{
            display: 'flex',
            ml: 'auto',
            color: 'white',
            borderColor: 'white',
          }}
          endIcon={<LogoutIcon />}
          onClick={handleLogoutClick}
        >
          Log out
        </Button>
      </Header>

      {/* サイドバー */}
      <NavigationMenu isOpen={isNavigationMenuOpen} onClose={handleNavigationMenuClose} />

      {/* メインコンテンツ */}
      <Main $isDownLaptop={isDownLaptop} $isNavigationMenuOpen={isNavigationMenuOpen}>
        <Outlet />
      </Main>

      <footer style={{ minHeight: `${footerHeight}px` }}>Footer 未実装</footer>
    </Box>
  )
}

export default AuthedLayout
