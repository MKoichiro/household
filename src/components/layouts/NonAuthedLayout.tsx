import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet } from 'react-router-dom'
import HeaderTitle from './common/HeaderTitle'
import { headerMainHeight } from '../../shared/constants/ui'
import LayoutRoot from './common/LayoutRoot'

const NonAuthedLayout = () => {
  return (
    <LayoutRoot>
      {/* ヘッダー */}
      <AppBar position="fixed" sx={{ width: '100%', ml: 2, backgroundColor: (theme) => theme.palette.header.main }}>
        <Toolbar>
          <HeaderTitle redirectTo="/" />
        </Toolbar>
      </AppBar>

      {/* メインコンテンツ */}
      <Box component="main" sx={{ p: 3, width: '100vw', mt: `${headerMainHeight}px` }}>
        <Outlet />
      </Box>
    </LayoutRoot>
  )
}

export default NonAuthedLayout
