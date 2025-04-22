// src/components/layout/AuthedLayout.tsx
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import NavigationMenu from '../common/NavigationMenu'
import LogoutIcon from '@mui/icons-material/Logout'
import { footerHeight, headerHeight, navigationMenuWidth } from '../../shared/constants/ui'
import HeaderTitle from '../common/HeaderTitle'
import { Button, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useApp, useAuth } from '../../shared/hooks/useContexts'
import styled from '@emotion/styled'
import { purple } from '@mui/material/colors'

const Header = styled.header<{ $isNavigationMenuOpen: boolean }>`
  background-color: ${({ theme }) => theme.palette.header.main};

  position: fixed;
  top: 0;
  left: ${({ $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0')};
  z-index: ${({ theme }) => theme.zIndex.header.lg};
  width: ${({ $isNavigationMenuOpen }) => `calc(100% - ${$isNavigationMenuOpen ? navigationMenuWidth : 0}px)`};
  height: ${headerHeight}px;
  transition:
    left 0.3s ease,
    width 0.3s ease;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    left: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.header.md};
  }
`
const HeaderMain = styled.div`
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: ${headerHeight - 32}px;
`
const HeaderNews = styled.div`
  background-color: ${purple[100]};
  color: ${purple[900]};
  height: 32px;
`

const Main = styled.main<{ $isNavigationMenuOpen: boolean }>`
  margin-top: ${headerHeight}px;
  margin-left: ${({ $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0')};
  transition: margin-left 0.3s ease;
  min-height: calc(100lvh - ${headerHeight}px);

  ${({ theme }) => theme.breakpoints.down('lg')} {
    margin-left: 0;
  }
`

const AuthedLayout = () => {
  const { isNavigationMenuOpen, setIsNavigationMenuOpen } = useApp()
  const { isLogoutProcessing, handleLogout } = useAuth()

  const handleNavigationMenuClose = () => setIsNavigationMenuOpen(false)
  const handleNavigationMenuToggle = () => setIsNavigationMenuOpen((prev) => !prev)

  // エラーハンドリングはhandleLogout内で行う
  const logout = () => void handleLogout()

  return (
    <Box sx={{ bgcolor: (theme) => theme.palette.grey[100], position: 'relative', minHeight: '100lvh' }}>
      {/* ヘッダー */}
      <Header $isNavigationMenuOpen={isNavigationMenuOpen}>
        <HeaderNews>
          <Typography
            variant="body2"
            sx={{
              padding: '0.25rem 1rem',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            お知らせ: 2023/10/01 サーバーのメンテナンスを行います。
          </Typography>
        </HeaderNews>
        <HeaderMain>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
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

          <HeaderTitle redirectTo="home" />

          <Button
            variant="outlined"
            aria-label="ログアウトボタン"
            sx={{
              display: 'flex',
              ml: 'auto',
              color: 'white',
              borderColor: 'white',
            }}
            endIcon={<LogoutIcon />}
            onClick={logout}
            disabled={isLogoutProcessing}
          >
            ログアウト
          </Button>
        </HeaderMain>
      </Header>

      {/* サイドバー */}
      <NavigationMenu isOpen={isNavigationMenuOpen} onClose={handleNavigationMenuClose} />

      {/* メインコンテンツ */}
      <Main $isNavigationMenuOpen={isNavigationMenuOpen}>
        <Outlet />
      </Main>

      <footer style={{ minHeight: `${footerHeight}px` }}>Footer 未実装</footer>
    </Box>
  )
}

export default AuthedLayout
