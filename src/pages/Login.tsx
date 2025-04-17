// Login.tsx - ログインページコンポーネント
// ログイン後リダイレクト、ログインユーザーのアクセス時のリダイレクト処理はCheckAuthコンポーネントに一任
import { Container, TextField, Button, Typography, Paper, Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth, useNotifications } from '../hooks/useContexts'
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
  const { addNotification } = useNotifications()
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
      await handleLogin(data.email, data.password)
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
        timer: 3000,
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      addNotification({
        severity: 'success',
        message: 'ログインしました！',
      })
      // リダイレクトはCheckAuthガードコンポーネントで行う
    } catch (error) {
      console.error('ログイン失敗:', error)
      addNotification({
        severity: 'error',
        message:
          '1. ログインに失敗しました。再度お試しください。ログインに失敗しました。再度お試しください。ログインに失敗しました。再度お試しください。ログインに失敗しました。再度お試しください。ログインに失敗しました。再度お試しください。ログインに失敗しました。再度お試しください。ログインに失敗しました。再度お試しください。ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '2. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '3. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '4. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '5. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '6. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '1. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '2. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '3. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '4. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '5. ログインに失敗しました。再度お試しください。',
      })
      addNotification({
        severity: 'error',
        message: '6. ログインに失敗しました。再度お試しください。',
      })
      reset()
    }
  }

  // void 演算子でsubmitHandler(onSubmit)()関数の返り値のハンドリングはしないことを示す
  // （onSubmit関数内のエラーハンドリングは活きている）
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    void submitHandler(onSubmit)(e)
  }

  return (
    <Container
      maxWidth="md"
      sx={{ height: `calc(100% - ${headerHeight}px)`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
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
                  autoComplete="email" // usernameとしてもエラーではない。セマンティックな意味にとどまる
                  error={Boolean(errors.email)}
                  helperText={errors.email ? errors.email.message : ''}
                  margin="normal"
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
                  autoComplete="current-password" // 既存のパスワードを入力するためのファームであることを明示、パスワードマネージャーが使う
                  error={Boolean(errors.password)}
                  helperText={errors.password ? errors.password.message : ''}
                  margin="normal"
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
          sx={{ display: 'block', mt: 3, ml: 'auto' }}
        >
          アカウントの新規作成はこちらから
        </Button>
      </Paper>
    </Container>
  )
}

export default Login
