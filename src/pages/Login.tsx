// Login.tsx - ログインページコンポーネント
// ログイン後のリダイレクト処理はCheckAuthコンポーネントに一任
import { Container, TextField, Button, Typography, Paper, Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth, useNotification } from '../hooks/useContexts'
import { headerHeight } from '../constants/ui'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormEvent } from 'react'

// zodスキーマでバリデーションルールを定義
const loginSchema = z.object({
  email: z.string().nonempty({ message: 'メールアドレスは必須です' }),
  password: z.string().nonempty({ message: 'パスワードは必須です' }),
})

// スキーマから型を推論
type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
  const { handleLogin } = useAuth()
  const { setMessage, Notification } = useNotification()
  const navigate = useNavigate()
  const {
    formState: { errors },
    handleSubmit: submitHandler,
    control,
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      // handleLoginで認証処理を実行
      await handleLogin(data.email, data.password)
      setMessage('ログインしました！')
    } catch (error) {
      console.error('ログイン失敗:', error)
      setMessage('ログインに失敗しました。再度お試しください。')
      reset()
    }
  }

  // void 演算子でsubmitHandler(onSubmit)()関数の返り値のハンドリングはしないことを示す
  // （onSubmit関数内のエラーハンドリングは活きている）
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    void submitHandler(onSubmit)(e)
  }

  return (
    <Container
      maxWidth="md"
      sx={{ height: `calc(100% - ${headerHeight}px)`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {/* ログイン失敗時のフラッシュメッセージ */}
      <Notification severity="error" />

      <Paper elevation={3} sx={{ width: { xs: '90%', sm: 400, md: 600 }, p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">
              ログイン
            </Typography>

            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="メールアドレス"
                  type="email"
                  margin="normal"
                  error={Boolean(errors.email)}
                  helperText={errors.email ? errors.email.message : ''}
                  fullWidth
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="パスワード"
                  type="password"
                  margin="normal"
                  error={Boolean(errors.password)}
                  helperText={errors.password ? errors.password.message : ''}
                  fullWidth
                />
              )}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              ログイン
            </Button>
          </Stack>
        </Box>
        <Button
          onClick={() => void navigate('/auth/signup')}
          color="secondary"
          // fullWidth
          sx={{ display: 'block', mt: 3, ml: 'auto' }}
        >
          アカウントの新規作成はこちらから
        </Button>
      </Paper>
    </Container>
  )
}

export default Login
