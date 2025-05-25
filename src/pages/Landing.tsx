import { Box, Typography } from '@mui/material'
import { APP_NAME } from '../shared/constants/app'

const Landing = () => {
  return (
    <Box>
      <Typography variant="h3" component="h2">
        {APP_NAME.DISPLAY} へようこそ
      </Typography>
      <Typography>まずはログインまたはアカウント作成をお願いします。</Typography>
    </Box>
  )
}

export default Landing
