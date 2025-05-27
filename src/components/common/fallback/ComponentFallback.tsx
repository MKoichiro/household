import { Box, Button, Typography } from '@mui/material'

interface ComponentFallback {
  error: Error
  resetErrorBoundary: () => void
}

const ComponentFallback = ({ error, resetErrorBoundary }: ComponentFallback) => {
  if (import.meta.env.DEV) console.error('Error:', error)
  return (
    <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid red', borderRadius: 1 }}>
      <Typography color="error" gutterBottom>
        コンテンツの読み込みに失敗しました。
      </Typography>
      <Button variant="outlined" size="small" onClick={resetErrorBoundary}>
        再読み込み
      </Button>
    </Box>
  )
}

export default ComponentFallback
