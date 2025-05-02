import { Box, Typography, Button } from '@mui/material'

interface GlobalFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

const GlobalFallback = ({ error, resetErrorBoundary }: GlobalFallbackProps) => (
  <Box role="alert" sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4" color="error">
      予期せぬエラーが発生しました
    </Typography>
    <Typography variant="body1" sx={{ mt: 2 }}>
      {error.message}
    </Typography>
    <Button variant="contained" onClick={resetErrorBoundary} sx={{ mt: 3 }}>
      再読み込み
    </Button>
  </Box>
)

export default GlobalFallback
