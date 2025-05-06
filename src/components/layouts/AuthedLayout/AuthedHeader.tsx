import styled from '@emotion/styled'
import { Button, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import HeaderTitle from '../common/HeaderTitle'
import { useAuth, useLayout } from '../../../shared/hooks/useContexts'
import { headerMainHeight, headerNewsHeight, navigationMenuWidth } from '../../../shared/constants/ui'
import NewsBar from './HeaderNews'
import { useRef, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { headerMenuTree } from './headerMenuTree'
import ContextMenuOrigin from '../../common/ContextMenu/ContextMenuOrigin'

interface AuthedHeaderProps {
  onMenuToggleClick: () => void
  isNavigationMenuOpen: boolean
}

const AuthedHeader = ({ onMenuToggleClick: handleMenuToggleClick, isNavigationMenuOpen }: AuthedHeaderProps) => {
  const { isLogoutProcessing, handleLogout } = useAuth()
  const { isNewsOpen } = useLayout()

  // エラーハンドリングはhandleLogout内で行う
  const logout = () => void handleLogout()

  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)
  const toggleBtnRef = useRef<HTMLButtonElement>(null)
  const handleClose = () => setOpen(false)
  const handleMenuToggle = () => setOpen((prev) => !prev)

  const menuTree = headerMenuTree(
    <Button
      variant="text"
      aria-label="ログアウトボタン"
      sx={{
        display: 'flex',
        m: 0,
        color: 'white',
        borderColor: 'white',
      }}
      disabled={isLogoutProcessing}
      startIcon={<LogoutIcon />}
      onClick={logout}
      ref={toggleBtnRef}
    >
      ログアウト
    </Button>
  )

  return (
    <HeaderRoot $isNavigationMenuOpen={isNavigationMenuOpen} $isNewsOpen={isNewsOpen} ref={anchorRef}>
      <NewsBar />
      <HeaderMain $isNewsOpen={isNewsOpen}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={handleMenuToggleClick}
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MenuIcon />
        </IconButton>

        <HeaderTitle redirectTo="home" />

        <IconButton
          aria-label="ヘッダーメニュー開閉ボタン"
          onClick={handleMenuToggle}
          ref={toggleBtnRef}
          sx={{
            display: 'flex',
            ml: 'auto',
            color: 'white',
            borderColor: 'white',
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </HeaderMain>
      <ContextMenuOrigin
        open={open}
        menuTree={menuTree}
        autoIcon={true}
        onClose={handleClose}
        closeBtnRef={toggleBtnRef}
        direction="left"
        position={{
          type: 'anchor',
          anchorRef: anchorRef,
          anchorRelativity: 'outerBottomRight',
          // clicked: 'document',
          offset: { x: -8, y: 8 },
        }}
      />
    </HeaderRoot>
  )
}

export default AuthedHeader

const HeaderRoot = styled.header<{ $isNavigationMenuOpen: boolean; $isNewsOpen: boolean }>`
  background-color: ${({ theme }) => theme.palette.header.main};

  position: sticky;
  top: ${({ $isNewsOpen }) => ($isNewsOpen ? `-${headerNewsHeight}px` : '0')};
  left: ${({ $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0')};
  z-index: ${({ theme }) => theme.zIndex.header.lg};
  width: ${({ $isNavigationMenuOpen }) => `calc(100% - ${$isNavigationMenuOpen ? navigationMenuWidth : 0}px)`};
  height: ${({ $isNewsOpen }) => `${$isNewsOpen ? headerMainHeight + headerNewsHeight : headerMainHeight}px`};
  transition:
    left 300ms ease,
    width 300ms ease,
    height 300ms ease;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    left: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.header.md};
  }
`

const HeaderMain = styled.div<{ $isNewsOpen: boolean }>`
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: ${headerMainHeight}px;
  transform: translateY(${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '-32px')});
  transition: transform 300ms ease;
`
