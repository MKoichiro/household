// src/components/layout/AuthedLayout.tsx
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Toolbar from '@mui/material/Toolbar'
import SideBar from '../common/SideBar'
import { useState } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import { sideBarWidth } from '../../constants/ui'
import HeaderTitle from '../common/HeaderTitle'
import { Button } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useAuth, useApp, useNotification } from '../../hooks/useContexts'

const AuthedLayout = () => {
  const [mobileSideBarOpen, setMobileSideBarOpen] = useState(false)
  const { isSideBarOpen, setIsSideBarOpen } = useApp()
  const { handleLogout } = useAuth()
  const { setNotification } = useNotification()

  const handleDrawerClose = () => {
    setIsSideBarOpen(false)
    setMobileSideBarOpen(false)
  }

  const handleDrawerTransitionEnd = () => {
    setIsSideBarOpen(true)
  }

  const handleDrawerToggle = () => {
    if (isSideBarOpen) setMobileSideBarOpen(!mobileSideBarOpen)
  }

  const handleLogoutClick = () => {
    handleLogout()
      .then(() => {
        // リダイレクト処理はRequireAuthガードコンポーネントが行う
        setNotification({
          severity: 'success',
          message: 'ログアウトしました。',
          timer: 3000,
        })
      })
      .catch((error) => {
        console.error('Logout failed:', error)
        setNotification({
          severity: 'error',
          message: '内部エラーによりログアウトに失敗しました。時間をおいて再度お試しください。',
        })
      })
  }

  return (
    <Box
      sx={{
        display: { md: 'flex' },
        bgcolor: (theme) => theme.palette.grey[100],
        minHeight: '100vh',
      }}
    >
      {/* ヘッダー */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${sideBarWidth}px)` },
          ml: { md: `${sideBarWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <HeaderTitle />

          <Box sx={{ ml: 'auto' }}>
            <Button
              variant="outlined"
              aria-label="log out"
              sx={{
                color: 'white',
                borderColor: 'white',
              }}
              endIcon={<LogoutIcon />}
              onClick={handleLogoutClick}
            >
              Log out
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* サイドバー */}
      <SideBar
        mobileSideBarOpen={mobileSideBarOpen}
        handleDrawerClose={handleDrawerClose}
        handleDrawerTransitionEnd={handleDrawerTransitionEnd}
      />

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${sideBarWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default AuthedLayout
