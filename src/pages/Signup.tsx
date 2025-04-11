// SignUp.tsx - 新規登録ページコンポーネント
import { useEffect, useState } from 'react'
import { Container, TextField, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useContexts'

const SignUp = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user, handleSignup } = useAuth()
  const navigate = useNavigate()

  // アクセス時ガード: App.tsx
  // サインアップ発火時: サーバーとの非同期通信がレンダリング以上に時間がかかる場合に重要、userの変化をトリガーにリダイレクト
  useEffect(() => {
    if (user) navigate('/app/home', { replace: true })
  }, [user, navigate])

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" component="h1" gutterBottom>
        新規登録
      </Typography>
      <TextField
        label="メールアドレス"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <TextField
        label="パスワード"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleSignup(email, password)}>
        アカウント作成
      </Button>
      <Button color="secondary" fullWidth onClick={() => navigate('/auth/login')} sx={{ mt: 2 }}>
        ログインはこちら
      </Button>
    </Container>
  )
}

export default SignUp
