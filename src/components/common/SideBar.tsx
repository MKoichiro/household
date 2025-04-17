import { Box, Drawer, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { sideBarWidth } from '../../constants/ui'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import styled from '@emotion/styled'
import { BareAccordionContent, BareAccordionHead } from './Accordion'
import { useAccordions } from '../../hooks/useAccordion'
import HomeIcon from '@mui/icons-material/Home'
import EqualizerIcon from '@mui/icons-material/Equalizer'
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import VpnKeyIcon from '@mui/icons-material/VpnKey'

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

interface SidebarProps {
  mobileSideBarOpen: boolean
  handleDrawerClose: () => void
  handleDrawerTransitionEnd: () => void
}

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

const SideBar = ({ mobileSideBarOpen, handleDrawerClose, handleDrawerTransitionEnd }: SidebarProps) => {
  return (
    <Box component="nav" sx={{ width: { md: sideBarWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
      {/* モバイル用 */}
      <Drawer
        variant="temporary"
        open={mobileSideBarOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: 'block', sm: 'none' }, // 表示制御
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sideBarWidth,
          },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        <DrawerItems />
      </Drawer>

      {/* PC用 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' }, // 表示制御
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sideBarWidth,
          },
        }}
        open
      >
        <DrawerItems />
      </Drawer>
    </Box>
  )
}

export default SideBar

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
