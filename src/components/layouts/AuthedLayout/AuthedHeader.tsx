import styled from '@emotion/styled'
import { Button, IconButton } from '@mui/material'
import HeaderTitle from '../common/HeaderTitle'
import { useAuth, useLayout } from '../../../shared/hooks/useContexts'
import { headerMainHeight, headerNewsHeight } from '../../../shared/constants/ui'
import NewsBar from './HeaderNews'
import { headerMenuConfigs, headerMenuTree } from './contextMenuConfigs'
import ContextMenu from '../../common/ContextMenu/ContextMenu'
import { useContextMenu } from '../../common/ContextMenu/hooks/useContextMenus'
import { LogoutIcon, MenuIcon, MenuOpenIcon, MoreVertIcon } from '../../../icons'
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
    <StyledButton aria-label="ログアウトボタン" disabled={isLogoutProcessing} endIcon={<LogoutIcon />} onClick={logout}>
      ログアウト
    </StyledButton>
  )
  const menuConfigs = headerMenuConfigs(menuTree)
  const { open, positionStyle, register, handleToggle, anchorRef, clickAwayRef } = useContextMenu(menuConfigs)

  return (
    <HeaderRoot $isNavigationMenuOpen={isNavigationMenuOpen} $isNewsOpen={isNewsOpen} ref={anchorRef}>
      <NewsBar />
      <HeaderMain $isNewsOpen={isNewsOpen}>
        {isNavigationMenuOpen ? (
          <NavigationMenuIconButton aria-label="ナビゲーションメニューを閉じるボタン" onClick={handleMenuToggleClick}>
            <MenuOpenIcon />
          </NavigationMenuIconButton>
        ) : (
          <NavigationMenuIconButton aria-label="ナビゲーションメニューを開くボタン" onClick={handleMenuToggleClick}>
            <MenuIcon />
          </NavigationMenuIconButton>
        )}

        <HeaderTitle redirectTo="home" />

        <ThemeToggler />

        <ContextMenuIconButton aria-label="コンテキストメニュー開閉ボタン" onClick={handleToggle} ref={clickAwayRef}>
          <MoreVertIcon />
        </ContextMenuIconButton>
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

const StyledButton = styled(Button)`
  --common-color: ${({ theme }) => theme.palette.ui.header.contrastText[theme.palette.mode]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0;
  padding-left: 0;
  color: var(--common-color);
  border-color: var(--common-color);
  font-size: 1.4rem;
  line-height: 3em;
  height: 3em;
  font-weight: 400;
`

const NavigationMenuIconButton = styled(IconButton)`
  margin-right: 1.6rem;
  color: ${({ theme }) => theme.palette.ui.header.contrastText[theme.palette.mode]};
  display: flex;
  align-items: center;
`

const ContextMenuIconButton = styled(IconButton)`
  display: flex;
  color: ${({ theme }) => theme.palette.ui.header.contrastText[theme.palette.mode]};
`

const HeaderRoot = styled.header<{ $isNavigationMenuOpen: boolean; $isNewsOpen: boolean }>`
  background-color: ${({ theme }) => theme.palette.ui.header.bg[theme.palette.mode]};
  color: ${({ theme }) => theme.palette.ui.header.contrastText[theme.palette.mode]};

  position: sticky;
  top: ${({ $isNewsOpen }) => ($isNewsOpen ? `-${headerNewsHeight}px` : '0')};
  left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.lg : '0')};
  z-index: ${({ theme }) => theme.zIndex.header.lg};
  width: ${({ $isNavigationMenuOpen, theme }) =>
    `calc(100% - ${$isNavigationMenuOpen ? theme.width.navigationMenu.lg : '0px'})`};
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
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: ${headerMainHeight}px;
  transform: translateY(${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '-32px')});
  transition: transform 300ms ease;
`

const StyledContextMenu = styled(ContextMenu)`
  ul.menu-list {
    background-color: ${({ theme }) => theme.palette.ui.header.bg[theme.palette.mode]};
    color: ${({ theme }) => theme.palette.ui.header.contrastText[theme.palette.mode]};
    border-radius: 0.8rem;
    margin-left: 0.5rem;
    box-shadow: ${({ theme }) => theme.shadows[10]};
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
