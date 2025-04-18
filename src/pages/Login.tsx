// Login.tsx - ログインページコンポーネント
// ログイン後リダイレクト、ログインユーザーのアクセス時のリダイレクト処理はCheckAuthコンポーネントに一任
import { TextField } from '@mui/material'
import { useAuth, useNotifications } from '../hooks/useContexts'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormEvent } from 'react'
import * as AuthPagesCommon from '../components/common/AuthPagesCommons'

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
    <AuthPagesCommon.Root>
      <AuthPagesCommon.Form title="ログイン" onSubmit={handleSubmit}>
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
      </AuthPagesCommon.Form>
      <AuthPagesCommon.NavigateButton path="/auth/signup" innerText="アカウントの新規作成はこちらから" sx={{ mt: 3 }} />
    </AuthPagesCommon.Root>
  )
}

export default Login
