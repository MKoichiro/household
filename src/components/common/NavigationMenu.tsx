import { css, IconButton, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { footerHeight, navigationMenuWidth } from '../../shared/constants/ui'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import styled from '@emotion/styled'
import { BareAccordionHead, BareAccordionContent } from './Accordion'
import { useAccordions } from '../../shared/hooks/useAccordion'
import HomeIcon from '@mui/icons-material/Home'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import CampaignIcon from '@mui/icons-material/Campaign'
import LogoutIcon from '@mui/icons-material/Logout'
import { indigo, purple } from '@mui/material/colors'
import { ReactNode } from 'react'
import { useAuth, useLayout } from '../../shared/hooks/useContexts'

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
          <Typography variant="body1">{item.label}</Typography>
        </StyledNavLink>
      </StyledLi>
    )
  }

  // サブメニューがある場合はアコーディオンを表示
  return (
    <StyledLi>
      <AccordionHead open={accordions[item.id].open} component="h3" onClick={toggle(item.id)}>
        {item.icon}
        <Typography variant="body1">{item.label}</Typography>
        <IconButton
          aria-label={`${item.label}のサブメニューを開閉`}
          sx={{
            color: 'inherit',
            ml: 'auto',
            px: 1,
            transform: accordions[item.id].open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 300ms',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </AccordionHead>
      <AccordionContent
        $isOpen={accordions[item.id].open}
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
                <Typography variant="body1">{subItem.label}</Typography>
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
          <Typography variant="body1">ログアウト</Typography>
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

const NavigationMenu = ({ isOpen, onClose }: NavigationMenuProps) => {
  const { dynamicHeaderHeight } = useLayout()
  return (
    <>
      <Mask $isOpen={isOpen} onClick={onClose} />
      <NavigationMenuRoot
        role="navigation"
        aria-label="ナビゲーションメニュー"
        $isOpen={isOpen}
        $dynamicHeaderHeight={dynamicHeaderHeight()}
      >
        <StickyContext>
          <NavigationMenuItemsList />
        </StickyContext>
      </NavigationMenuRoot>
    </>
  )
}

export default NavigationMenu

// スタイル
const StyledUl = styled.ul`
  color: ${purple[900]};
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
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
  cursor: pointer;
`
const LinkButtonCommonStyle = css`
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  gap: 1rem;
  align-items: center;
  padding: 0.25rem 2rem 0.25rem 0.5rem;
  margin: 0.25rem 0;
  border-top-right-radius: 2rem;
  border-bottom-right-radius: 2rem;
  background-color: inherit;

  &.active {
    color: white;
    background-color: ${purple[900]};
    transform: scale(1.05);
  }
  &:hover {
    background-color: ${purple[500]};
    color: white;
    transform: scale(1.05);
  }

  transition:
    background-color 200ms ease,
    color 200ms ease,
    transform 200ms ease;
`
const StyledNavLink = styled(NavLink)`
  ${LinkButtonCommonStyle}
`
const StyledInnerNavLink = styled(StyledNavLink)`
  padding-left: 2rem;
`
const StyledIconButton = styled(IconButton)`
  border-radius: 0;
  ${LinkButtonCommonStyle}
`
const AccordionHead = styled(BareAccordionHead)`
  cursor: pointer;
  margin: 0;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 0 0.5rem 0.5rem;
  &:hover {
    color: ${purple[500]};
    border-bottom: 6px double ${purple[500]};
  }
  &[aria-expanded='true'] {
    color: ${purple[500]};
    border-bottom: 6px double ${purple[500]};
  }
  transition: border-bottom 200ms ease;
`
const AccordionContent = styled(BareAccordionContent)<{ $isOpen: boolean; $height: number }>`
  overflow: hidden;
  transition: height 300ms ease-in-out;
  height: ${({ $isOpen, $height }) => ($isOpen ? `${$height}px` : '0')};
`
const NavigationMenuRoot = styled.nav<{ $isOpen: boolean; $dynamicHeaderHeight: number }>`
  position: absolute;
  left: 0;
  top: ${({ $dynamicHeaderHeight }) => `-${$dynamicHeaderHeight}px`};
  bottom: ${footerHeight}px;
  z-index: ${({ theme }) => theme.zIndex.navigationMenu.lg};
  display: flex;
  flex-direction: column;
  width: ${navigationMenuWidth}px;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : `translateX(-100%)`)};
  background-color: ${({ theme }) => theme.palette.background.paper};
  transition:
    transform 300ms ease,
    top 300ms ease;
  overflow: clip;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    bottom: 0;
    width: 70vw;
  }
`
const Mask = styled.div<{ $isOpen: boolean }>`
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  transition: opacity 1s;

  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.navigationMenu.md - 1};
  height: 100lvh;

  ${({ theme }) => theme.breakpoints.up('lg')} {
    opacity: 0;
    pointer-events: none;
  }
`
const StickyContext = styled.div`
  position: relative;
  height: 100%;
  background-color: ${indigo[100]};
`
