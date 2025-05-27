import styled from '@emotion/styled'
import { alpha, IconButton } from '@mui/material'
import { useLocation } from 'react-router-dom'

import ContextMenu from '@components/common/ContextMenu/ContextMenu'
import { useContextMenu } from '@components/common/ContextMenu/hooks/useContextMenus'
import type { ContextMenuConfig } from '@components/common/ContextMenu/types'
import { MenuIcon, MenuOpenIcon, MoreVertIcon } from '@icons'
import HeaderTitle from '@layouts/common/HeaderTitle'
import { useAuth, useLayout } from '@shared/hooks/useContexts'
import { cp } from '@styles/theme/helpers/colorPickers'

import { createMenuConfigs, createMenuTree } from './contextMenuConfigs'
import NewsBar from './HeaderNews'
import ThemeToggler from './ThemeToggler'
import useContextMenuTop from './useContextMenuTop'

interface AuthedHeaderProps {
  onMenuToggleClick: () => void
  isNavigationMenuOpen: boolean
}

const AuthedHeader = ({ onMenuToggleClick: handleMenuToggleClick, isNavigationMenuOpen }: AuthedHeaderProps) => {
  const { isLogoutProcessing, handleLogout } = useAuth()
  const { isNewsOpen } = useLayout()
  const location = useLocation()
  const logout = () => void handleLogout()
  const menuTree = createMenuTree({ logoutButton: { isLogoutProcessing, logout } })
  const menuConfigs: ContextMenuConfig = createMenuConfigs(menuTree)
  const { open, register, handleToggle, clickAwayRef } = useContextMenu(menuConfigs)
  const { positionStyle, newsBarRef } = useContextMenuTop({ isContextMenuOpen: open, isNewsOpen })

  return (
    <HeaderRoot $isNavigationMenuOpen={isNavigationMenuOpen} $isNewsOpen={isNewsOpen}>
      <NewsBar ref={newsBarRef} />
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

        <HeaderTitle redirectTo={location.pathname === '/app/home' ? undefined : 'home'} />

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

// NOTE: position: sticky の場合、left: 明示; right: 0;で幅は変わらないので、width も明示する必要がある。
const HeaderRoot = styled.header<{ $isNavigationMenuOpen: boolean; $isNewsOpen: boolean }>`
  background-color: ${({ theme }) => cp(theme, 'ui.header.bg')};
  color: ${({ theme }) => cp(theme, 'ui.header.contrastText')};

  position: sticky;
  top: ${({ $isNewsOpen, theme }) => ($isNewsOpen ? `-${theme.height.headerNews.xs}` : '0')};
  left: 0;
  width: 100%;

  z-index: ${({ theme }) => theme.zIndex.header.xs};
  height: ${({ theme, $isNewsOpen }) =>
    $isNewsOpen ? `calc(${theme.height.header.xs} + ${theme.height.headerNews.xs})` : theme.height.header.xs};

  transition:
    left 300ms,
    width 300ms,
    height 300ms;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    top: ${({ $isNewsOpen, theme }) => ($isNewsOpen ? `-${theme.height.headerNews.sm}` : '0')};
    height: ${({ theme, $isNewsOpen }) =>
      $isNewsOpen ? `calc(${theme.height.header.sm} + ${theme.height.headerNews.sm})` : theme.height.header.sm};
    z-index: ${({ theme }) => theme.zIndex.header.sm};
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    top: ${({ $isNewsOpen, theme }) => ($isNewsOpen ? `-${theme.height.headerNews.md}` : '0')};
    left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.md : '0')};
    width: ${({ $isNavigationMenuOpen, theme }) =>
      `calc(100% - ${$isNavigationMenuOpen ? theme.width.navigationMenu.md : '0'})`};
    height: ${({ theme, $isNewsOpen }) =>
      $isNewsOpen ? `calc(${theme.height.header.md} + ${theme.height.headerNews.md})` : theme.height.header.md};
    z-index: ${({ theme }) => theme.zIndex.header.md};
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    top: ${({ $isNewsOpen, theme }) => ($isNewsOpen ? `-${theme.height.headerNews.lg}` : '0')};
    left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.lg : '0')};
    width: ${({ $isNavigationMenuOpen, theme }) =>
      `calc(100% - ${$isNavigationMenuOpen ? theme.width.navigationMenu.lg : '0'})`};
    height: ${({ theme, $isNewsOpen }) =>
      $isNewsOpen ? `calc(${theme.height.header.lg} + ${theme.height.headerNews.lg})` : theme.height.header.lg};
    z-index: ${({ theme }) => theme.zIndex.header.lg};
  }

  ${({ theme }) => theme.breakpoints.up('xl')} {
    top: ${({ theme, $isNewsOpen }) => ($isNewsOpen ? `-${theme.height.headerNews.xl}` : '0')};
    left: ${({ $isNavigationMenuOpen, theme }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.xl : '0')};
    width: ${({ $isNavigationMenuOpen, theme }) =>
      `calc(100% - ${$isNavigationMenuOpen ? theme.width.navigationMenu.xl : '0'})`};
    height: ${({ theme, $isNewsOpen }) =>
      $isNewsOpen ? `calc(${theme.height.header.xl} + ${theme.height.headerNews.xl})` : theme.height.header.xl};
    z-index: ${({ theme }) => theme.zIndex.header.xl};
  }
`

const HeaderMain = styled.div<{ $isNewsOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: ${({ theme }) => theme.height.header.xs};
  transform: translateY(${({ theme, $isNewsOpen }) => ($isNewsOpen ? '0' : `-${theme.height.headerNews.lg}`)});
  transition: transform 300ms;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: ${({ theme }) => theme.height.header.sm};
  }
  ${({ theme }) => theme.breakpoints.up('md')} {
    height: ${({ theme }) => theme.height.header.md};
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    height: ${({ theme }) => theme.height.header.lg};
  }
  ${({ theme }) => theme.breakpoints.up('xl')} {
    height: ${({ theme }) => theme.height.header.xl};
  }
`

const NavigationMenuIconButton = styled(IconButton)`
  margin-right: 1.6rem;
  color: inherit;
  display: flex;
  align-items: center;
`

const ContextMenuIconButton = styled(IconButton)`
  display: flex;
  color: inherit;
  margin-left: 1.6rem;
`

const StyledContextMenu = styled(ContextMenu)`
  transition: top 200ms linear;
  ul.menu-list {
    background-color: ${({ theme }) => alpha(cp(theme, 'ui.header.bg'), 0.6)};
    backdrop-filter: blur(3px);
    color: inherit;
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
