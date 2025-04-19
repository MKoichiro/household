import { AppBar, Box, Button, Toolbar } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'
import LoginIcon from '@mui/icons-material/Login'
import AddBoxIcon from '@mui/icons-material/AddBox'
import HeaderTitle from '../common/HeaderTitle'

const LandingLayout = () => {
  return (
    <Box
      sx={{
        display: { md: 'flex' },
        bgcolor: (theme) => theme.palette.grey[100],
        minHeight: '100vh',
      }}
    >
      {/* ヘッダー */}
      <AppBar position="fixed" sx={{ width: '100%', ml: 2, backgroundColor: (theme) => theme.palette.header.main }}>
        <Toolbar>
          <HeaderTitle />

          <Box sx={{ display: 'flex', gap: 2, ml: 'auto', mr: 2 }}>
            <NavLink to="/auth/signup">
              <Button
                variant="outlined"
                aria-label="sign up"
                sx={{ color: 'white', borderColor: 'white' }}
                endIcon={<AddBoxIcon />}
              >
                Sign Up
              </Button>
            </NavLink>

            <NavLink to="/auth/login">
              <Button
                variant="outlined"
                aria-label="log in"
                sx={{ color: 'white', borderColor: 'white' }}
                endIcon={<LoginIcon />}
              >
                Log in
              </Button>
            </NavLink>
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

export default LandingLayout
