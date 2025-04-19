import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet, useNavigate } from 'react-router-dom'
import HeaderTitle from '../common/HeaderTitle'

const NonAuthedLayout = () => {
  const navigate = useNavigate()
  return (
    <Box
      sx={{
        display: { md: 'flex' },
        bgcolor: (theme) => theme.palette.grey[100],
        minHeight: '100vh',
      }}
    >
      <AppBar position="fixed" sx={{ width: '100%', ml: 2, backgroundColor: (theme) => theme.palette.header.main }}>
        <Toolbar>
          <Box sx={{ cursor: 'pointer' }} onClick={() => void navigate('/', { replace: true })}>
            <HeaderTitle />
          </Box>
        </Toolbar>
      </AppBar>

      {/* メインコンテンツ */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100vw', mt: 8 }}>
        {/* <Toolbar /> */}
        <Outlet />
      </Box>
    </Box>
  )
}

export default NonAuthedLayout
