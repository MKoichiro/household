import { Box, Card, CardContent, Typography, Avatar } from '@mui/material'
import { useAuth } from '../hooks/useContexts'

const Settings = () => {
  const { user } = useAuth()

  // user 情報が取得できなかった場合のフォールバック
  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">ユーザー情報が取得できませんでした。</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              alt={user.displayName || user.email || 'User'}
              src={user.photoURL || undefined}
              sx={{ width: 80, height: 80, mb: 2 }}
            >
              {!user.photoURL &&
                (user.displayName ? user.displayName.charAt(0) : user.email ? user.email.charAt(0) : '?')}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user.displayName || '表示名未設定'}
            </Typography>
            <Typography variant="body1">Email: {user.email || '不明'}</Typography>
            <Typography variant="body2" color="text.secondary">
              UID: {user.uid}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email Verified: {user.emailVerified ? 'はい' : 'いいえ'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Settings
