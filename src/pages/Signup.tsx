// SignUp.tsx - 新規登録ページコンポーネント
// サインアップ後リダイレクト、ログインユーザーのアクセス時のリダイレクト処理はCheckAuthコンポーネントに一任
import { Container, TextField, Button, Typography, Paper, Box, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth, useNotification } from '../hooks/useContexts'
import { z } from 'zod'
import { Controller, useForm, SubmitHandler } from 'react-hook-form'
import { headerHeight } from '../constants/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormEvent } from 'react'

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
  const { setMessage, Notification } = useNotification()
  const navigate = useNavigate()

  const {
    formState: { errors },
    handleSubmit: submitHandler,
    control,
    reset,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      await handleSignup(data.email, data.password)
      setMessage('アカウントを作成しました。ようこそ家計簿アプリへ！')
      // リダイレクトはCheckAuthガードコンポーネントで行う
    } catch (error) {
      console.error('アカウント作成失敗:', error)
      setMessage('アカウント作成に失敗しました。再度お試しください。')
      reset()
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void submitHandler(onSubmit)(e)
  }

  return (
    <Container
      maxWidth="md"
      sx={{ height: `calc(100% - ${headerHeight}px)`, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      {/* アカウント作成失敗時のフラッシュメッセージ */}
      <Notification severity="error" />

      <Paper elevation={3} sx={{ width: { xs: '90%', sm: 400, md: 600 }, p: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">
              新規登録
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

            <Controller
              name="passwordConfirmation"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="パスワード確認"
                  type="password"
                  margin="normal"
                  error={Boolean(errors.passwordConfirmation)}
                  helperText={errors.passwordConfirmation ? errors.passwordConfirmation.message : ''}
                  fullWidth
                />
              )}
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
              アカウント作成
            </Button>
          </Stack>
        </Box>
        <Button
          onClick={() => void navigate('/auth/login')}
          color="secondary"
          sx={{ display: 'block', mt: 3, ml: 'auto' }}
        >
          既に登録済みですか？ログインはこちらから
        </Button>
      </Paper>
    </Container>
  )
}

export default SignUp
