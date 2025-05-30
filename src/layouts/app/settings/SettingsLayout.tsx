import { Avatar, Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@shared/hooks/useContexts'
import { pagePadding } from '@styles/constants'
import { cpf } from '@styles/theme/helpers/colorPickers'

const SettingsLayout = () => {
  const { user } = useAuth()
  const location = useLocation()

  let title = ''
  switch (location.pathname) {
    case '/app/settings/basic':
      title = '基本情報'
      break
    case '/app/settings/security':
      title = 'セキュリティ'
      break
    default:
      title = '設定'
      break
  }

  // レイアウトの性質上、アバターとタイトルは少し左にずらすとより「真ん中っぽく」見える
  const adjustCenter = { transform: 'translateX(-0.8rem)' }

  return (
    <Box display="flex" justifyContent="center" p={pagePadding}>
      <Card
        sx={{
          maxWidth: 700,
          width: '100%',
          bgcolor: cpf('app.lighterBg.level2.bg'),
        }}
      >
        <CardContent>
          {/* ヘッダー：アバターとタイトル */}
          <Stack component="header" direction="row" alignItems="center" justifyContent="center" spacing={2}>
            <Avatar
              alt={user?.displayName || user?.email || 'User'}
              src={user?.photoURL || undefined}
              sx={{ width: '3rem', height: '3rem', ...adjustCenter }}
            >
              {!user?.photoURL && (user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?')}
            </Avatar>
            <Typography variant="h5" component="h2" color="text.primary" sx={adjustCenter}>
              {title}
            </Typography>
          </Stack>

          <Divider sx={{ my: 2, bgcolor: 'lightgrey' }} />

          <Outlet />
        </CardContent>
      </Card>
    </Box>
  )
}

export default SettingsLayout
