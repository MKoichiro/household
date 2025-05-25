import { IconButton, Theme, Typography, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { BareAccordionHead, BareAccordionContent } from '../../common/Accordion'
import { useAccordions } from '../../../shared/hooks/useAccordion'
import { ReactNode } from 'react'
import { useAuth, useLayout } from '../../../shared/hooks/useContexts'
import {
  AccountCircleIcon,
  CampaignIcon,
  EqualizerIcon,
  ExpandMoreIcon,
  HomeIcon,
  LogoutIcon,
  SettingsIcon,
  VpnKeyIcon,
} from '../../../icons'
import Mask from '../../common/Mask'

interface MenuItemBase {
  id: string
  label: string
  icon: ReactNode
}

interface LinkMenuItem extends MenuItemBase {
  to: string
}

interface AccordionMenuItem extends MenuItemBase {
  accordionDefault: boolean
  sub: LinkMenuItem[]
}

// メニューアイテムの型定義
type NavigationMenuItem = LinkMenuItem | AccordionMenuItem

// メニュー構成定義（外部ファイルに切り出しても可）
const NAVIGATION_MENU_ITEMS: NavigationMenuItem[] = [
  { id: 'home', label: 'ホーム', to: '/app/home', icon: <HomeIcon /> },
  { id: 'report', label: '月間レポート', to: '/app/report', icon: <EqualizerIcon /> },
  {
    id: 'settings',
    label: '設定',
    icon: <SettingsIcon />,
    accordionDefault: false,
    sub: [
      { id: 'basic-info', label: '基本情報', to: '/app/settings/basic', icon: <AccountCircleIcon /> },
      { id: 'security', label: 'セキュリティ', to: '/app/settings/security', icon: <VpnKeyIcon /> },
    ],
  },
  { id: 'news', label: 'お知らせ', to: '/app/news', icon: <CampaignIcon /> },
]

// アコーディオンの有無チェック
const isAccordionItem = (item: NavigationMenuItem): item is AccordionMenuItem => {
  return 'sub' in item
}

// 個別メニューアイテムコンポーネント
const NavigationMenuItemComponent = ({ item }: { item: NavigationMenuItem }) => {
  // サブメニュー用フック
  const defaults = isAccordionItem(item) ? { [item.id]: item.accordionDefault ?? false } : {}
  const { contentRefs, accordions, toggle } = useAccordions(defaults)

  if (!isAccordionItem(item)) {
    return (
      <StyledLi>
        <StyledNavLink to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
          {item.icon}
          <Typography>{item.label}</Typography>
        </StyledNavLink>
      </StyledLi>
    )
  }

  // サブメニューがある場合はアコーディオンを表示
  return (
    <StyledLi>
      <AccordionHead open={accordions[item.id].open} component="h3" onClick={toggle(item.id)}>
        {item.icon}
        <Typography>{item.label}</Typography>
        <AccordionToggleIconButton $open={accordions[item.id].open} aria-label={`${item.label}のサブメニューを開閉`}>
          <ExpandMoreIcon />
        </AccordionToggleIconButton>
      </AccordionHead>
      <AccordionContent
        $open={accordions[item.id].open}
        $height={accordions[item.id].height}
        ref={contentRefs[item.id]}
      >
        <StyledUl>
          {item.sub.map((subItem) => (
            <StyledLi key={subItem.id}>
              <StyledInnerNavLink
                tabIndex={accordions[item.id].open ? 0 : -1} // 閉じている時は非活性
                to={subItem.to}
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                {subItem.icon}
                <Typography>{subItem.label}</Typography>
              </StyledInnerNavLink>
            </StyledLi>
          ))}
        </StyledUl>
      </AccordionContent>
    </StyledLi>
  )
}

// メニューリスト全体
const NavigationMenuItemsList = () => {
  const { isLogoutProcessing, handleLogout } = useAuth()
  const logout = () => void handleLogout()

  return (
    <StyledOuterUl>
      {/* メニューアイテム */}
      {NAVIGATION_MENU_ITEMS.map((item) => (
        <NavigationMenuItemComponent key={item.id} item={item} />
      ))}

      {/* スペーサー & ログアウトボタン */}
      <li className="navigation-menu-spacer" style={{ height: '64px' }} />
      <StyledLi>
        <StyledIconButton onClick={logout} aria-label="ログアウトボタン" disabled={isLogoutProcessing}>
          <LogoutIcon />
          <Typography>ログアウト</Typography>
        </StyledIconButton>
      </StyledLi>
    </StyledOuterUl>
  )
}

// メインコンポーネント
interface NavigationMenuProps {
  isOpen: boolean
  onClose: () => void
}

const NavigationMenu = ({ isOpen, onClose: handleClose }: NavigationMenuProps) => {
  const { dynamicHeaderHeight } = useLayout()
  const theme = useTheme()
  return (
    <aside>
      <Mask $open={isOpen} $zIndex={theme.zIndex.navigationMenu.md - 1} onClick={handleClose} />
      <NavigationMenuRoot
        role="navigation"
        aria-label="ナビゲーションメニュー"
        $open={isOpen}
        $dynamicHeaderHeight={dynamicHeaderHeight()}
      >
        <StickyContext>
          <NavigationMenuItemsList />
        </StickyContext>
      </NavigationMenuRoot>
    </aside>
  )
}

const StyledUl = styled.ul`
  color: ${({ theme }) => theme.palette.ui.navigationMenu.item.inactive.font[theme.palette.mode]};
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
  gap: 0.6rem;
`

const StyledOuterUl = styled(StyledUl)`
  padding-top: 1rem;
  margin: 0;
  position: sticky;
  top: 0;
`

const StyledLi = styled.li`
  color: inherit;
  list-style: none;
  margin: 0;
  font-size: 1.6rem;
`

// DOM に $open を渡さない
const AccordionToggleIconButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== '$open' })<{
  $open: boolean
}>`
  color: inherit;
  margin-left: auto;
  padding: 0 1rem;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 300ms ease;
`

const LinkButtonCommonStyle = (theme: Theme) => css`
  --active-bg-color: ${theme.palette.ui.navigationMenu.item.active.bg[theme.palette.mode]};
  --active-font-color: ${theme.palette.ui.navigationMenu.item.active.font[theme.palette.mode]};
  --hover-bg-color: ${theme.palette.ui.navigationMenu.item.hover.bg[theme.palette.mode]};
  --hover-font-color: ${theme.palette.ui.navigationMenu.item.hover.font[theme.palette.mode]};
  cursor: pointer;
  height: 1.8em;
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  gap: 1.25rem;
  align-items: center;
  padding: 0.25rem 2rem 0.25rem 1rem;
  margin: 0.25rem 0;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
  background-color: inherit;

  &.active {
    color: var(--active-font-color);
    background-color: var(--active-bg-color);
    transform: scale(1.05);
  }
  &:hover {
    color: var(--hover-font-color);
    background-color: var(--hover-bg-color);
    transform: scale(1.05);
  }

  transform-origin: center;
  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 200ms ease;
`

const StyledNavLink = styled(NavLink)`
  ${({ theme }) => LinkButtonCommonStyle(theme)}
`

const StyledInnerNavLink = styled(StyledNavLink)`
  padding-left: 2rem;
`

const StyledIconButton = styled(IconButton)`
  font-size: 1.6rem;
  height: 1.8em;
  border-radius: 0;
  ${({ theme }) => LinkButtonCommonStyle(theme)}
`

const AccordionHead = styled(BareAccordionHead)`
  --active-color: ${({ theme }) => theme.palette.ui.navigationMenu.accordionHead.active.font[theme.palette.mode]};
  --hover-color: ${({ theme }) => theme.palette.ui.navigationMenu.accordionHead.hover.font[theme.palette.mode]};
  cursor: pointer;
  margin: 0;
  display: flex;
  gap: 1.25rem;
  align-items: center;
  padding: 0.25rem 0 0.25rem 1rem;
  height: 1.8em;
  &:hover {
    color: var(--hover-color);
    border-bottom: 6px double var(--hover-color);
  }
  &[aria-expanded='true'] {
    color: var(--active-color);
    border-bottom: 6px double var(--active-color);
  }
  transition: border-bottom 200ms ease;
`

const AccordionContent = styled(BareAccordionContent)<{ $open: boolean; $height: number }>`
  overflow: hidden;
  transition: height 300ms ease-in-out;
  height: ${({ $open, $height }) => ($open ? `${$height}px` : '0')};

  li:first-of-type {
    margin-top: 0.8rem;
  }
`

const NavigationMenuRoot = styled.nav<{ $open: boolean; $dynamicHeaderHeight: number }>`
  position: absolute;
  left: 0;
  top: ${({ $dynamicHeaderHeight }) => `-${$dynamicHeaderHeight}px`};
  bottom: 0;
  z-index: ${({ theme }) => theme.zIndex.navigationMenu.lg};
  display: flex;
  flex-direction: column;
  width: ${({ theme }) => theme.width.navigationMenu.lg};
  transform: ${({ $open }) => ($open ? 'translateX(0)' : `translateX(-100%)`)};
  transition:
    transform 300ms ease,
    top 300ms ease;
  overflow: clip;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    position: fixed;
    top: 0;
    bottom: 0;
    width: ${({ theme }) => theme.width.navigationMenu.md};
  }
  ${({ theme }) => theme.breakpoints.down('md')} {
    width: ${({ theme }) => theme.width.navigationMenu.sm};
  }
`

const StickyContext = styled.div`
  position: relative;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.ui.navigationMenu.bodyBg[theme.palette.mode]};
`

export default NavigationMenu
