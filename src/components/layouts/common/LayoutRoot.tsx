import { Box } from '@mui/material'
import type { ReactNode } from 'react'

import { cpf } from '@styles/theme/helpers/colorPickers'

import Footer from './Footer'

const LayoutRoot = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      sx={{
        bgcolor: cpf('ui.bodyBg'),
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
