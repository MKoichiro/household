// Login.tsx - ログインページコンポーネント
import { useEffect, useState } from 'react'
import { Container, TextField, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useContexts'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { user, handleLogin } = useAuth()
  const navigate = useNavigate()

  // アクセス時ガード: App.tsx
  // ログイン発火時: サーバーとの非同期通信がレンダリング以上に時間がかかる場合に重要、userの変化をトリガーにリダイレクト
  useEffect(() => {
    if (user) navigate('/app/home', { replace: true })
  }, [user, navigate])

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" component="h1" gutterBottom>
        ログイン
      </Typography>
      <TextField
        label="メールアドレス"
        type="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="パスワード"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin(email, password)}>
        ログイン
      </Button>
      <Button color="secondary" fullWidth onClick={() => navigate('/auth/signup')} sx={{ mt: 2 }}>
        アカウント作成はこちら
      </Button>
    </Container>
  )
}

export default Login
