import { Avatar, Box, Card, CardContent, Divider, Typography } from '@mui/material'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth, useNotification } from '../../hooks/useContexts'

const SettingsLayout = () => {
  const { user } = useAuth()
  const { Notification } = useNotification()
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

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Notification severity="info" autoHideDuration={3000} />
      <Card sx={{ maxWidth: 700, width: '100%' }}>
        <CardContent>
          {/* ヘッダー：アバターとタイトル */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              alt={user?.displayName || user?.email || 'User'}
              src={user?.photoURL || undefined}
              sx={{ width: 80, height: 80 }}
            >
              {!user?.photoURL && (user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?')}
            </Avatar>
            <Typography variant="h5" component="h2" color="text.primary">
              {title}
            </Typography>
          </Box>

          <Divider />

          <Outlet />
        </CardContent>
      </Card>
    </Box>
  )
}

export default SettingsLayout
