import { Box } from '@mui/material'
import { ReactNode } from 'react'
import Footer from './Footer'

const LayoutRoot = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        bgcolor: (theme) => theme.palette.ui.bodyBg[theme.palette.mode],
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ width: 'inherit' }}>{children}</div>
      <Footer />
    </Box>
  )
}

export default LayoutRoot
