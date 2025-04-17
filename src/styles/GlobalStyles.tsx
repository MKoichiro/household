// src/styles/GlobalStyles.tsx
import { GlobalStyles as MUIGlobalStyles } from '@mui/material'

const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={
        {
          // '@scroll-timeline notificationScroll': {
          //   source: 'self',
          //   orientation: 'block',
          //   'scroll-offsets': 'auto',
          // },
          // '@keyframes fadeShadow': {
          //   from: { opacity: 1 },
          //   to: { opacity: 0 },
          // },
        }
      }
    />
  )
}

export default GlobalStyles
