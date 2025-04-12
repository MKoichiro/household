// SignUp.tsx - 新規登録ページコンポーネント
import { useEffect, useState } from 'react'
import { Container, TextField, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useContexts'
import { z } from 'zod'

// 前半部分の条件:
// 英字が少なくとも1文字含まれることをチェック (?=.[A-Za-z])
// 数字が少なくとも1桁含まれることをチェック (?=.[0-9])
// 後半部分:
// 文字列全体が半角英数字と半角記号（ASCII 33～126、スペース除く）で構成されていることを確認
const passwordRegex = /^(?=.[A-Za-z])(?=.[0-9])[A-Za-z0-9!-/:-@[-`{-~]+$/

// zodスキーマでバリデーションルールを定義
const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'メールアドレスは必須です' })
    .max(255, { message: 'メールアドレスは255文字以内である必要があります' })
    .email({ message: '有効なメールアドレスを入力してください' }),
  password: z
    .string()
    .nonempty({ message: 'パスワードは必須です' })
    .min(8, { message: 'パスワードは8文字以上である必要があります' })
    .max(72, { message: 'パスワードは72文字以内である必要があります' }) // has_secure_passwordの仕様と合わせる
    .regex(passwordRegex, { message: 'パスワードは英文字、数字を含む必要があります' }),
})

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
