// SignUp.tsx - 新規登録ページコンポーネント
// サインアップ後リダイレクト、ログインユーザーのアクセス時のリダイレクト処理はCheckAuthコンポーネントに一任
import { TextField, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../shared/hooks/useContexts'
import { z } from 'zod'
import { Controller, useForm, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormEvent } from 'react'
import * as AuthPagesCommon from '../components/common/AuthPagesCommons'

// 前半部分の条件:
// 英字が少なくとも1文字含まれることをチェック (?=.*[A-Za-z])
// 数字が少なくとも1桁含まれることをチェック (?=.*[0-9])
// 後半部分:
// 文字列全体が半角英数字と半角記号（ASCII 33～126、スペース除く）で構成されていることを確認
const passwordRegex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9!-/:-@[-`{-~]+$/

// zodスキーマでバリデーションルールを定義
const signupSchema = z
  .object({
    email: z
      .string()
      .nonempty({ message: 'メールアドレスは必須です' })
      .max(255, { message: 'メールアドレスは255文字以内である必要があります' })
      .email({ message: '有効なメールアドレスを入力してください' }),
    password: z
      .string()
      .nonempty({ message: 'パスワードは必須です' })
      .min(8, { message: 'パスワードは8文字以上である必要があります' })
      // rails has_secure_passwordの仕様を参考に72文字。iOSのジェネレータはデフォルトで20文字。
      .max(72, { message: 'パスワードは72文字以内である必要があります' })
      .regex(passwordRegex, { message: 'パスワードは英文字、数字を含む必要があります' }),
    passwordConfirmation: z.string().nonempty({ message: 'パスワード確認は必須です' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'パスワードとパスワード確認が一致しません',
    path: ['passwordConfirmation'], // エラーメッセージを割り当てるフィールドの指定
  })
  .refine((data) => data.email !== data.password, {
    message: 'メールアドレスとパスワードは異なる必要があります',
    path: ['password'], // エラーメッセージを割り当てるフィールドの指定
  })

// スキーマから型を推論
type SignupFormValues = z.infer<typeof signupSchema>

const SignUp = () => {
  const { handleSignup } = useAuth()
  const navigate = useNavigate()

  const {
    formState: { errors },
    handleSubmit: submitHandler,
    control,
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', passwordConfirmation: '' },
  })

  // 基本的なエラーハンドリングはhandleSignupで行う
  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    handleSignup(data.email, data.password)
      .then(() => void navigate('/verify-email', { replace: true }))
      .catch(() => reset())
  }
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void submitHandler(onSubmit)(e)
  }

  return (
    <AuthPagesCommon.Root>
      <AuthPagesCommon.Form title="アカウント作成" onSubmit={handleSubmit}>
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
              autoComplete="new-password" // 新規パスワードを入力するためのファームであることを明示、パスワードジェネレータが使う
              error={Boolean(errors.password)}
              helperText={errors.password ? errors.password.message : ''}
              margin="normal"
              fullWidth
            />
          )}
        />

        <Controller
          name="passwordConfirmation"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="パスワード確認"
              type="password"
              autoComplete="new-password"
              error={Boolean(errors.passwordConfirmation)}
              helperText={errors.passwordConfirmation ? errors.passwordConfirmation.message : ''}
              margin="normal"
              fullWidth
            />
          )}
        />
      </AuthPagesCommon.Form>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        ...すでに登録がお済みですか？
      </Typography>
      <AuthPagesCommon.NavigateButton path="/auth/login" innerText="ログインはこちらから" />
    </AuthPagesCommon.Root>
  )
}

export default SignUp
