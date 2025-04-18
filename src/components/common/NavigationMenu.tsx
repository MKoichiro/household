import { Typography } from '@mui/material'
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
import { useApp } from '../../hooks/useContexts'

const StyledUl = styled.ul`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  padding: 0;
  margin: 0;
`

const StyledLi = styled.li`
  list-style: none;
  margin: 0;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`

const StyledNavLink = styled(NavLink)`
  width: 100%;
  color: inherit;
  text-decoration: none;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2, 2)};
`

const AccordionHead = styled(BareAccordionHead)`
  cursor: pointer;
  margin: 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  align-items: center;
  padding: ${({ theme }) => theme.spacing(2, 2)};
`

const AccordionContent = styled(BareAccordionContent)<{ $isOpen: boolean; $height: number }>`
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  height: ${({ $isOpen, $height }) => ($isOpen ? `${$height}px` : '0')};
`

const DrawerItems = () => {
  const { isOpens, contentHeights, contentRefs, toggle } = useAccordions(1, false)

  return (
    <StyledUl>
      <StyledLi>
        <StyledNavLink
          to="/app/home"
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'rgba(0 0 0 / 0.08)' : 'transparent',
          })}
        >
          <HomeIcon />
          <Typography variant="body1">ホーム</Typography>
        </StyledNavLink>
      </StyledLi>

      <StyledLi>
        <StyledNavLink
          to="/app/report"
          style={({ isActive }) => ({
            backgroundColor: isActive ? 'rgba(0 0 0 / 0.08)' : 'transparent',
          })}
        >
          <EqualizerIcon />
          <Typography variant="body1">月間レポート</Typography>
        </StyledNavLink>
      </StyledLi>

      {/* 設定アコーディオン */}
      <StyledLi>
        <AccordionHead component="h3" onClick={toggle(0)}>
          <SettingsIcon />
          <Typography variant="body1">設定</Typography>
          <ExpandMoreIcon
            style={{
              marginLeft: 'auto',
              transform: isOpens[0] ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s',
            }}
          />
        </AccordionHead>
        <AccordionContent $isOpen={isOpens[0]} $height={contentHeights[0]} ref={contentRefs[0]}>
          <StyledUl>
            <StyledLi>
              <StyledNavLink
                to="/app/settings/basic"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'rgba(0 0 0 / 0.08)' : 'transparent',
                })}
              >
                <AccountCircleIcon />
                <Typography variant="body1">基本情報</Typography>
              </StyledNavLink>
            </StyledLi>
            <StyledLi>
              <StyledNavLink
                to="/app/settings/security"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? 'rgba(0 0 0 / 0.08)' : 'transparent',
                })}
              >
                <VpnKeyIcon />
                <Typography variant="body1">セキュリティ</Typography>
              </StyledNavLink>
            </StyledLi>
          </StyledUl>
        </AccordionContent>
      </StyledLi>
    </StyledUl>
  )
}

interface NavigationMenuProps {
  isOpen: boolean
  onClose: () => void
}

const NavigationMenu = ({ isOpen, onClose: handleClose }: NavigationMenuProps) => {
  const { isDownLaptop } = useApp()
  return (
    <>
      <Mask $isDownLaptop={isDownLaptop} $isOpen={isOpen} onClick={handleClose} />

      <NavigationMenuRoot $isOpen={isOpen}>
        <DrawerItems />
      </NavigationMenuRoot>
    </>
  )
}

export default NavigationMenu

const NavigationMenuRoot = styled.nav<{ $isOpen: boolean }>`
  position: absolute;
  left: 0;
  top: -${headerHeight}px;
  bottom: ${footerHeight}px;
  z-index: ${({ theme }) => theme.zIndex.navigationMenu.lg};
  display: flex;
  flex-direction: column;
  min-width: ${navigationMenuWidth}px;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : `translateX(-${navigationMenuWidth}px)`)};
  background-color: pink;
  transition: transform 0.3s ease;
  overflow: hidden;
`

const Mask = styled.div<{ $isDownLaptop: boolean; $isOpen: boolean }>`
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${({ $isDownLaptop, $isOpen }) => {
    if (!$isDownLaptop) return 0
    return $isOpen ? 1 : 0
  }};
  pointer-events: ${({ $isDownLaptop, $isOpen }) => {
    if (!$isDownLaptop) return 'none'
    return $isOpen ? 'auto' : 'none'
  }};

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
`
