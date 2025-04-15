// src/pages/VerifyEmail.tsx
import { Button, Typography, Box } from '@mui/material'
import { sendEmailVerification } from 'firebase/auth'
import { useAuth, useNotification } from '../hooks/useContexts'

const VerifyEmail = () => {
  const { user } = useAuth()
  const { setNotification } = useNotification()

  const handleResendVerification = async () => {
    console.log('再送信ボタンがクリックされました。')
    if (user) {
      try {
        await sendEmailVerification(user)
        setNotification({
          severity: 'success',
          message: '確認メールを再送信しました。メールをご確認ください。',
          timer: 3000,
        })
      } catch (error) {
        console.error('再送信に失敗しました:', error)
        setNotification({
          severity: 'error',
          message: '確認メールの再送信に失敗しました。',
        })
      }
    }
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        メールアドレスの確認が必要です
      </Typography>
      <Typography variant="body1" gutterBottom>
        登録されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックしてアカウントを有効化してください。
      </Typography>
      <Typography variant="body1" gutterBottom>
        有効化が済みましたら、こちらのページをリロードするか、https://household-1dc1b.web.app/app/home
        にアクセスしてください。
      </Typography>
      <Button variant="contained" color="primary" onClick={() => void handleResendVerification()}>
        確認メールを再送信する
      </Button>
    </Box>
  )
}

export default VerifyEmail
