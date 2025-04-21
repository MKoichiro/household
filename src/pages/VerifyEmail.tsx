// src/pages/VerifyEmail.tsx
import { Button, Typography, Box } from '@mui/material'
import { useAuth } from '../shared/hooks/useContexts'

const VerifyEmail = () => {
  const { handleResendVerificationEmail } = useAuth()
  const handleResendVerification = () => void handleResendVerificationEmail()

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
      <Button variant="contained" color="primary" onClick={handleResendVerification}>
        確認メールを再送信する
      </Button>
    </Box>
  )
}

export default VerifyEmail
