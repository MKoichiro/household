// Login.tsx - ログインページコンポーネント
// ログイン後リダイレクト、ログインユーザーのアクセス時のリダイレクト処理はCheckAuthコンポーネントに一任
import { TextField } from '@mui/material'
import { useAuth } from '../shared/hooks/useContexts'
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
  const {
    formState: { errors },
    handleSubmit: submitHandler,
    control,
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  // エラーハンドリングはhandleLogin内で行う
  const onSubmit: SubmitHandler<LoginFormValues> = (data) => void handleLogin(data.email, data.password)
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void submitHandler(onSubmit)(e)
    reset()
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
