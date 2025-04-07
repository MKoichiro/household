import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import useTimer from "../hooks/useTimer"
import { Box, Button, Divider, Typography } from "@mui/material"
import { theme } from "../theme/theme"
import { headerHeight } from "../constants/ui"

const NoMatch = () => {
  const home = { path: "/app/home", display: "ホーム" }
  const login = { path: "/auth/login", display: "ログインページ" }

  const { user } = useAuth()
  const navigate = useNavigate()
  const { count, intervalId } = useTimer({init: 30, type: "decrement"})
  const [isStopped, setIsStopped] = useState(false)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      // 未ログインならログインページへ、ログイン済みならHomeページへリダイレクト
      navigate(user ? home.path : login.path, { replace: true })
    }, 30000)
    setTimeoutId(timer)

    return () => clearTimeout(timer)
  }, [navigate, user])

  const handleStopClick = () => {
    if (intervalId) clearInterval(intervalId)
    if (timeoutId) clearTimeout(timeoutId)
    setIsStopped(true)
  }

  const handleHomeClick = () => {
    navigate(user ? home.path : login.path, { replace: true })
  }

  return (
    <Box
      sx={{
        height: `calc(100% - ${headerHeight}px)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        p: 3
      }}
    >
      {/* 上部 */}
      <Box>
        <Typography variant="h2">
          404: Not Found.
        </Typography>
        <Typography variant="h5" component="p">
          このページは既に削除されたか、存在していません。
        </Typography>
      </Box>

      {/* 下部 */}
      <Divider sx={{ mt: "auto", mb: 1 }}/>

      <Box sx={{ display: "flex", flexDirection: "column", textAlign: "right", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "right", gap: 1}}>
            <Typography
              component="time"
              variant="h5"
              sx={{ verticalAlign: "bottom" }}
              dateTime={`PT${count}S`}
              color={ isStopped ? theme.palette.grey[500] : 'inherit' }
            >
              {count} 秒
            </Typography>
            <Typography
              color={ isStopped ? theme.palette.grey[500] : 'inherit' }
            >
              後に自動的に{user ? home.display : login.display}へ遷移します。
            </Typography>
          </Box>
        <Box>
          {!isStopped ? (
            <Button
              variant="contained"
              onClick={handleStopClick}
              disabled={isStopped}
            >
              タイマーを止める
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleHomeClick}
              disabled={!isStopped}
            >
              {user ? home.display : login.display}へ
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default NoMatch

// ログインページに移動したときにuserがいるならホームへ移動
// 