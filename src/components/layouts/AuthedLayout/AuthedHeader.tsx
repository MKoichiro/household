import styled from '@emotion/styled'
import { Button, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import HeaderTitle from '../common/HeaderTitle'
import { useAuth, useLayout } from '../../../shared/hooks/useContexts'
import { headerMainHeight, headerNewsHeight, navigationMenuWidth } from '../../../shared/constants/ui'
import NewsBar from './HeaderNews'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { headerMenuConfigs, headerMenuTree } from './contextMenuConfigs'
import ContextMenu from '../../common/ContextMenu/ContextMenu'
import { useContextMenu } from '../../common/ContextMenu/hooks/useContextMenus'

interface AuthedHeaderProps {
  onMenuToggleClick: () => void
  isNavigationMenuOpen: boolean
}

const AuthedHeader = ({ onMenuToggleClick: handleMenuToggleClick, isNavigationMenuOpen }: AuthedHeaderProps) => {
  const { isLogoutProcessing, handleLogout } = useAuth()
  const { isNewsOpen } = useLayout()

  // エラーハンドリングはhandleLogout内で行う
  const logout = () => void handleLogout()

  // コンテキストメニューの設定
  const menuTree = headerMenuTree(
    <Button
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
    >
      ログアウト
    </Button>
  )
  const menuConfigs = headerMenuConfigs(menuTree)
  // const { registers, anchorRefs, togglers, clickAwayRefs } = useContextMenus(menuConfigs)
  const { open, positionStyle, register, handleToggle, anchorRef, clickAwayRef } = useContextMenu(menuConfigs)

  return (
    <HeaderRoot $isNavigationMenuOpen={isNavigationMenuOpen} $isNewsOpen={isNewsOpen} ref={anchorRef}>
      <NewsBar />
      <HeaderMain $isNewsOpen={isNewsOpen}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          // edge="start"
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
          onClick={handleToggle}
          ref={clickAwayRef}
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
      <ContextMenu {...register} open={open} positionStyle={positionStyle} />
    </HeaderRoot>
  )
}

const HeaderRoot = styled.header<{ $isNavigationMenuOpen: boolean; $isNewsOpen: boolean }>`
  background-color: ${({ theme }) => theme.palette.ui.header.bg.main};

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

export default AuthedHeader
