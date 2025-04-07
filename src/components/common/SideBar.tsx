import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from "@mui/material"
import { Home, Equalizer, Settings } from '@mui/icons-material'
import React, { CSSProperties } from "react";
import { NavLink } from "react-router-dom";
import { sideBarWidth } from "../../constants/ui";

interface menuItem {
  text: string,
  path: string,
  icon: React.ComponentType
}

const MenuItems: menuItem[] = [
  {text: "ホーム", path: "/app/home", icon: Home},
  {text: "月間レポート", path: "/app/report", icon: Equalizer},
  {text: "設定", path: "/app/settings", icon: Settings}
]

const baseLinkStyle: CSSProperties = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
}

const activeLinkStyle: CSSProperties = {
  backgroundColor: "rgba(0 0 0 / 0.08)"
}

interface SidebarProps {
  mobileSideBarOpen: boolean,
  handleDrawerClose: () => void,
  handleDrawerTransitionEnd: () => void,
}

const SideBar = ({
  mobileSideBarOpen,
  handleDrawerClose,
  handleDrawerTransitionEnd,
}: SidebarProps) => {

  const drawer = (
    <div>
      {/* 上部の余白 */}
      <Toolbar />

      <Divider />

      <List>
        {MenuItems.map(item => (
          <NavLink
            key={item.text}
            to={item.path}
            style={({isActive}) => ({
              ...baseLinkStyle,
              ...(isActive ? activeLinkStyle : {})
              })
            }
          >
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </div>
  )

  return (
    <Box
      component="nav"
      sx={{ width: { md: sideBarWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* モバイル用 */}
      <Drawer
        variant="temporary"
        open={mobileSideBarOpen}
        onTransitionEnd={handleDrawerTransitionEnd}
        onClose={handleDrawerClose}
        sx={{
          display: { xs: 'block', sm: 'none' }, // 表示制御
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sideBarWidth },
        }}
        slotProps={{
          root: {
            keepMounted: true, // Better open performance on mobile.
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* PC用 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' }, // 表示制御
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: sideBarWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default SideBar
