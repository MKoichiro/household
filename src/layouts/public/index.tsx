import { AppBar, Box, Button, Toolbar } from '@mui/material'
import { NavLink, Outlet } from 'react-router-dom'

import { AddBoxIcon, LoginIcon } from '@shared/icons'
import HeaderTitle from '@layouts/components/HeaderTitle'
import LayoutRoot from '@layouts/components/LayoutRoot'
import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { cpf } from '@styles/theme/helpers/colorPickers'

const PublicLayout = () => {
  const { bp } = useBreakpoint()
  return (
    <LayoutRoot>
      {/* ヘッダー */}
      <AppBar
        sx={{
          position: 'fixed',
          width: '100%',
          ml: 2,
          bgcolor: cpf('ui.header.bg.main'),
          zIndex: (theme) => theme.zIndex.header[bp],
        }}
      >
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
                サインアップ
              </Button>
            </NavLink>

            <NavLink to="/auth/login">
              <Button
                variant="outlined"
                aria-label="log in"
                sx={{ color: 'white', borderColor: 'white' }}
                endIcon={<LoginIcon />}
              >
                ログイン
              </Button>
            </NavLink>
          </Box>
        </Toolbar>
      </AppBar>

      {/* メインコンテンツ */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%', mt: (theme) => theme.height.header[bp] }}>
        <Outlet />
      </Box>
    </LayoutRoot>
  )
}

export default PublicLayout
