// TODO: 同一ブラウザで異なる複数の新規登録を行った場合、ローカルストレージのタイマーが別アカウント間で継承されてしまう。
import { Button, Typography, Box } from '@mui/material'
import { useEffect } from 'react'

import { useAuth } from '@shared/hooks/useContexts'
import useTimer from '@shared/hooks/useTimer'

const resendInterval = 100 // 公式に明言されてはいないようだが、経験上100秒待てば再送信できる。

const VerifyEmail = () => {
  const { handleResendVerificationEmail } = useAuth()
  const onEnd = () => {
    localStorage.removeItem('resendVerificationEmailDate') // タイマー終了時にローカルストレージから削除
  }
  const { count, isRunning, reset, set, start } = useTimer({
    init: resendInterval,
    step: 1,
    delay: 1000,
    type: 'decrement',
    end: 0,
    startNow: false,
    onEnd,
  })

  // 初回ロード時にローカルストレージからカウントを取得
  useEffect(() => {
    const storedDate = localStorage.getItem('resendVerificationEmailDate')
    const now = new Date().getTime()
    if (storedDate) {
      const storedTime = new Date(storedDate).getTime()
      const elapsedSeconds = Math.floor((now - storedTime) / 1000)
      const remainingSeconds = resendInterval - elapsedSeconds

      if (remainingSeconds > 0) {
        set(remainingSeconds)
        start()
      } else {
        reset()
      }
    } else {
      // サインアップページからの初回リダイレクト時
      reset()
      start()
      localStorage.setItem('resendVerificationEmailDate', String(new Date())) // 初回送信日時を保存
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ハンドラー
  const handleResendVerification = () => {
    reset()
    start()
    localStorage.setItem('resendVerificationEmailDate', String(new Date()))
    void handleResendVerificationEmail()
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        メールアドレスの確認が必要です
      </Typography>
      <Typography gutterBottom>
        登録されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックしてアカウントを有効化してください。
      </Typography>
      <Typography gutterBottom>有効化が済みましたら、こちらのページをリロードしてください。</Typography>
      <Button variant="contained" color="primary" onClick={handleResendVerification} disabled={isRunning && count >= 0}>
        {isRunning && count >= 0
          ? `確認メールを送信しました。${String(count).padStart(3, '\u00A0')} 秒後に再送信できます。`
          : '確認メールを再送信する'}
      </Button>
    </Box>
  )
}

export default VerifyEmail
