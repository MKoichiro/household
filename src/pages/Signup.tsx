// SignUp.tsx - 新規登録ページコンポーネント
import { useState } from 'react'
import { Container, TextField, Button, Typography } from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate("/home")  // 登録成功時にHomeページへ遷移
    } catch (err) {
      console.error("登録失敗:", err)
      // TODO: エラーハンドリング
    }
  }

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" component="h1" gutterBottom>
        新規登録
      </Typography>
      <TextField
        label="メールアドレス"
        type="email"
        fullWidth margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="パスワード"
        type="password"
        fullWidth margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button 
        variant="contained" color="primary" fullWidth 
        onClick={handleSignUp}
      >
        アカウント作成
      </Button>
      <Button 
        color="secondary" fullWidth 
        onClick={() => navigate('/login')}
        style={{ marginTop: 8 }}
      >
        ログインはこちら
      </Button>
    </Container>
  )
}

export default SignUp
