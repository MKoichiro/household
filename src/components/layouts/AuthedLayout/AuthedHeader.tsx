import styled from '@emotion/styled'
import { Button, IconButton } from '@mui/material'
import HeaderTitle from '../common/HeaderTitle'
import { useAuth, useLayout } from '../../../shared/hooks/useContexts'
import { headerMainHeight, headerNewsHeight, navigationMenuWidth } from '../../../shared/constants/ui'
import NewsBar from './HeaderNews'
import { headerMenuConfigs, headerMenuTree } from './contextMenuConfigs'
import ContextMenu from '../../common/ContextMenu/ContextMenu'
import { useContextMenu } from '../../common/ContextMenu/hooks/useContextMenus'
import { LogoutIcon, MenuIcon, MoreVertIcon } from '../../../icons'
import ThemeToggler from './ThemeToggler'

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
        p: 0,
        pl: '1rem',
        color: 'white',
        borderColor: 'white',
        fontSize: '1.4rem',
        lineHeight: '3em',
        height: '3em',
        fontWeight: 400,
      }}
      disabled={isLogoutProcessing}
      startIcon={<LogoutIcon />}
      onClick={logout}
    >
      ログアウト
    </Button>
  )
  const menuConfigs = headerMenuConfigs(menuTree)
  const { open, positionStyle, register, handleToggle, anchorRef, clickAwayRef } = useContextMenu(menuConfigs)

  return (
    <HeaderRoot $isNavigationMenuOpen={isNavigationMenuOpen} $isNewsOpen={isNewsOpen} ref={anchorRef}>
      <NewsBar />
      <HeaderMain $isNewsOpen={isNewsOpen}>
        <IconButton
          color="inherit"
          aria-label="ナビゲーションメニュー開閉ボタン"
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

        <ThemeToggler />

        <IconButton
          aria-label="ヘッダーメニュー開閉ボタン"
          onClick={handleToggle}
          ref={clickAwayRef}
          sx={{
            display: 'flex',
            color: 'white',
            borderColor: 'white',
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </HeaderMain>
      <StyledContextMenu
        {...register}
        open={open}
        positionStyle={positionStyle}
        subMenuPosition={{ strategy: 'absoluteTop' }}
      />
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

const StyledContextMenu = styled(ContextMenu)`
  ul.menu-list {
    background-color: ${({ theme }) => theme.palette.ui.header.bg.main};
    border-radius: 0.8rem;
    margin-left: 0.5rem;
    li.menu-item {
      button {
        font-size: 1.4rem;
        line-height: 3em;
        height: 3em;
        border-radius: 0.8rem;
        padding-left: 1rem;
      }
    }
  }
`

export default AuthedHeader
