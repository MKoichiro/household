import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import { Outlet } from 'react-router-dom'

import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { cpf } from '@styles/theme/helpers/colorPickers'

import HeaderTitle from './common/HeaderTitle'
import LayoutRoot from './common/LayoutRoot'

const NonAuthedLayout = () => {
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
          <HeaderTitle redirectTo="/" />
        </Toolbar>
      </AppBar>

      {/* メインコンテンツ */}
      <Box component="main" sx={{ p: 3, width: '100%', mt: (theme) => theme.height.header[bp] }}>
        <Outlet />
      </Box>
    </LayoutRoot>
  )
}

export default NonAuthedLayout
