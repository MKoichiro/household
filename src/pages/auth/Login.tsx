import { zodResolver } from '@hookform/resolvers/zod'
import { TextField } from '@mui/material'
import type { FormEvent } from 'react'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import * as AuthPagesCommon from '@pages/common/AuthPagesCommons'
import { useAuth } from '@shared/hooks/useContexts'

// zodスキーマでバリデーションルールを定義
const loginSchema = z.object({
  email: z.string().nonempty({ message: 'メールアドレスは必須です' }),
  password: z.string().nonempty({ message: 'パスワードは必須です' }),
})

// スキーマから型を推論
type LoginFormValues = z.infer<typeof loginSchema>

const Login = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
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
  const onSubmit: SubmitHandler<LoginFormValues> = (data) =>
    handleLogin(data.email, data.password).finally(() => setIsSubmitting(false))
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    void submitHandler(onSubmit)(e)
    reset()
  }

  return (
    <AuthPagesCommon.Root>
      <AuthPagesCommon.Form title="ログイン" buttonText="ログイン" isSubmitting={isSubmitting} onSubmit={handleSubmit}>
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
              slotProps={{ htmlInput: { style: { fontSize: '16px' } } }}
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
