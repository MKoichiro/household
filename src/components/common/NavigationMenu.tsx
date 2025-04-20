import { IconButton, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { footerHeight, headerHeight, navigationMenuWidth } from '../../constants/ui'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import styled from '@emotion/styled'
import { BareAccordionContent, BareAccordionHead } from './Accordion'
import { useAccordions } from '../../hooks/useAccordion'
import HomeIcon from '@mui/icons-material/Home'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import { blue, purple } from '@mui/material/colors'
import { ReactNode } from 'react'

const StyledUl = styled.ul`
  color: ${blue[900]};
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

const StyledNavLink = styled(NavLink)`
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

const StyledInnerNavLink = styled(StyledNavLink)`
  padding-left: 2rem;
`

const AccordionHead = styled(BareAccordionHead)`
  cursor: pointer;
  margin: 0;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem 0 0.5rem 0.5rem;
  &:hover {
    border-bottom: 6px double ${blue[900]};
  }
  &[aria-expanded='true'] {
    border-bottom: 6px double ${blue[900]};
  }
  transition: border-bottom 200ms ease;
`

const AccordionContent = styled(BareAccordionContent)<{ $isOpen: boolean; $height: number }>`
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  height: ${({ $isOpen, $height }) => ($isOpen ? `${$height}px` : '0')};
`

const NavigationMenuRoot = styled.nav<{ $isOpen: boolean }>`
  position: absolute;
  left: 0;
  top: -${headerHeight}px;
  bottom: ${footerHeight}px;
  z-index: ${({ theme }) => theme.zIndex.navigationMenu.lg};
  display: flex;
  flex-direction: column;
  width: ${navigationMenuWidth}px;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : `translateX(-100%)`)};
  background-color: ${({ theme }) => theme.palette.background.paper};
  transition: transform 0.3s ease;
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
  transition: opacity 1000ms;

  /* 画面を覆う */
  position: fixed;
  // position: -webkit-fixed; /* fixed 未対応ブラウザ用 */
  top: 0;
  right: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.navigationMenu.md - 1};
  height: 100lvh;

  /* 背景をボカす */
  /* backdrop-filter: blur(5px); */
  /* -webkit-backdrop-filter: blur(5px); fixed 未対応ブラウザ用 */

  ${({ theme }) => theme.breakpoints.up('lg')} {
    opacity: 0;
    pointer-events: none;
  }
`

const StickyContext = styled.div`
  position: relative;
  height: 100%;
`

type SubMenu = {
  accordionIndex: number
  items: MenuItem[]
}

type MenuItem = {
  id: string
  label: string
  to: string
  icon: ReactNode
  sub?: SubMenu
}

const MENU: MenuItem[] = [
  { id: 'home', label: 'ホーム', to: '/app/home', icon: <HomeIcon /> },
  { id: 'report', label: '月間レポート', to: '/app/report', icon: <EqualizerIcon /> },
  {
    id: 'settings',
    label: '設定',
    to: '',
    icon: <SettingsIcon />,
    sub: {
      accordionIndex: 0,
      items: [
        { id: 'basic-info', label: '基本情報', to: '/app/settings/basic', icon: <AccountCircleIcon /> },
        { id: 'security', label: 'セキュリティ', to: '/app/settings/security', icon: <VpnKeyIcon /> },
      ],
    },
  },
]

// 型ガード
const hasSubMenu = (item: MenuItem): item is MenuItem & { sub: SubMenu } =>
  Array.isArray(item.sub?.items) && item.sub.items.length > 0

const DrawerItems = () => {
  const ACCORDION_DEFAULT_STATES = {
    settings: false,
  }
  const { contentRefs, accordions, toggle } = useAccordions(ACCORDION_DEFAULT_STATES)

  return (
    <StyledOuterUl>
      {MENU.map((item) =>
        !hasSubMenu(item) ? (
          <StyledLi key={item.id}>
            <StyledNavLink className={({ isActive }) => (isActive ? 'active' : undefined)} to={item.to}>
              {item.icon}
              <Typography variant="body1">{item.label}</Typography>
            </StyledNavLink>
          </StyledLi>
        ) : (
          // サブメニューがある場合はアコーディオンを表示
          <StyledLi key={item.id}>
            <AccordionHead aria-expanded={accordions[item.id].open} component="h3" onClick={toggle(item.id)}>
              {item.icon}
              <Typography variant="body1">{item.label}</Typography>
              <IconButton
                aria-label="サブメニューを開閉"
                sx={{
                  ml: 'auto',
                  px: 1,
                  transform: accordions[item.id].open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s',
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
                {item.sub?.items.map((subItem) => (
                  <StyledLi key={subItem.id}>
                    <StyledInnerNavLink className={({ isActive }) => (isActive ? 'active' : undefined)} to={subItem.to}>
                      {subItem.icon}
                      <Typography variant="body1">{subItem.label}</Typography>
                    </StyledInnerNavLink>
                  </StyledLi>
                ))}
              </StyledUl>
            </AccordionContent>
          </StyledLi>
        )
      )}
    </StyledOuterUl>
  )
}

interface NavigationMenuProps {
  isOpen: boolean
  onClose: () => void
}

const NavigationMenu = ({ isOpen, onClose: handleClose }: NavigationMenuProps) => (
  <>
    <Mask $isOpen={isOpen} onClick={handleClose} />

    <NavigationMenuRoot role="navigation" aria-label="ナビゲーションメニュー" $isOpen={isOpen}>
      <StickyContext>
        <DrawerItems />
      </StickyContext>
    </NavigationMenuRoot>
  </>
)

export default NavigationMenu
