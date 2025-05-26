import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useTimer from '../shared/hooks/useTimer'
import { Box, Button, Divider, Typography } from '@mui/material'
import { useAuth } from '../shared/hooks/useContexts'
import { grey } from '@mui/material/colors'
import { useBreakpoint } from '../shared/hooks/useBreakpoint'

const home = { path: '/app/home', display: 'ホーム' }
const login = { path: '/auth/login', display: 'ログインページ' }

const NotFound = () => {
  const { bp } = useBreakpoint()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { count, isRunning, stop: handleStopClick, kill } = useTimer({ init: 30, type: 'decrement', startNow: true })

  useEffect(() => {
    if (count <= 0) {
      kill()
      // 未ログインならログインページへ、ログイン済みならHomeページへリダイレクト
      void navigate(user ? home.path : login.path, { replace: true })
    }
  }, [count, kill, navigate, user])

  const handleHomeClick = () => {
    kill()
    void navigate(user ? home.path : login.path, { replace: true })
  }

  return (
    <Box
      sx={{
        // height: `calc(100% - ${headerMainHeight}px)`,
        height: (theme) => `calc(100vh - ${theme.height.header[bp]})`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 3,
      }}
    >
      {/* 上部 */}
      <Box>
        <Typography variant="h2">404: Not Found.</Typography>
        <Typography variant="h5" component="p">
          お探しのページは見つかりませんでした。
        </Typography>
      </Box>

      {/* 下部 */}
      <Divider sx={{ mt: 'auto', mb: 1 }} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'right',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'right',
            gap: 1,
          }}
        >
          <Typography
            component="time"
            variant="h5"
            dateTime={`PT${count}S`}
            sx={{ verticalAlign: 'bottom', color: isRunning ? 'inherit' : grey[500] }}
          >
            {count} 秒
          </Typography>
          <Typography sx={{ color: isRunning ? 'inherit' : grey[500] }}>
            後に自動的に{user ? home.display : login.display}
            へ遷移します。
          </Typography>
        </Box>
        <Box>
          {isRunning ? (
            <Button variant="contained" onClick={handleStopClick} disabled={!isRunning}>
              タイマーを止める
            </Button>
          ) : (
            <Button variant="contained" onClick={handleHomeClick} disabled={isRunning}>
              {user ? home.display : login.display}へ
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default NotFound
