import { Box, Typography } from "@mui/material"
import { useLoginRedirect } from "../hooks/useRedirects"

const Landing = () => {

  // ログイン済みのユーザーが"/"にアクセスした場合にリダイレクト
  useLoginRedirect("/app/home")

  return (
    <Box>
      <Typography variant="h3" component="h2">
        家計簿アプリへようこそ
      </Typography>
      <Typography>
        まずはログインまたはアカウント作成をお願いします。
      </Typography>
    </Box>
  )
}

export default Landing
