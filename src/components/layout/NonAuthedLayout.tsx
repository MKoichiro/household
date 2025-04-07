import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet } from 'react-router-dom'
import { theme } from '../../theme/theme'
import HeaderTitle from '../common/HeaderTitle'


const NonAuthedLayout = () => {

  return (
    <Box sx={{ display: { md: 'flex' }, bgcolor: theme.palette.grey[100], minHeight: "100vh" }}>

      {/* ヘッダー */}
      <AppBar position="fixed" sx={{ width: "100%", ml: 2 }} >
        <Toolbar>
          <HeaderTitle />
        </Toolbar>
      </AppBar>

      {/* メインコンテンツ */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: "100vw" }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default NonAuthedLayout
