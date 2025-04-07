// Login.tsx - ログインページコンポーネント
import { useState } from 'react';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ページ遷移に使用
import { useAuth } from '../context/AuthContext';
import { useLoginRedirect } from '../hooks/useRedirects';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { handleLogin: login } = useAuth()

  // ログイン済みのユーザーが"/auth/login"にアクセスした場合にリダイレクト
  useLoginRedirect("/app/home")

  const handleLogin = async (email: string, password: string) => {
    try {
      login(email, password)
      // navigate("/app/home", { replace: true })
    } catch (error) {
      console.error("ログインに失敗しました:", error)
    }
  }

  return (
    <Container maxWidth="xs">
      <Typography variant="h5" component="h1" gutterBottom>
        ログイン
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
        onClick={() => handleLogin(email, password)}
      >
        ログイン
      </Button>
      <Button 
        color="secondary" fullWidth 
        onClick={() => navigate('/signup')}
        style={{ marginTop: 8 }}
      >
        アカウント作成はこちら
      </Button>
    </Container>
  );
};

export default Login;
