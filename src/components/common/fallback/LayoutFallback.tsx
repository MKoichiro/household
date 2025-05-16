import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'

const LayoutFallback = () => {
  const error = useRouteError()
  let message = '不明なエラーが発生しました'

  // loader/actionでエラーが発生した場合
  if (isRouteErrorResponse(error)) {
    message = `Error ${error.status}: ${error.statusText}`
  }
  // JS ランタイムエラーを拾う場合
  else if (error instanceof Error) {
    message = error.message
  }

  return (
    <Box role="alert" sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h4" color="error">
        レイアウトの表示中にエラーが発生しました
      </Typography>
      <Typography sx={{ mt: 2 }}>{message}</Typography>

      {/* 自作しない限りページ全体のリロードしかできない。 */}
      <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 3 }}>
        再読み込み
      </Button>
    </Box>
  )
}

export default LayoutFallback
