// src/styles/GlobalStyles.tsx
import { GlobalStyles as MUIGlobalStyles } from '@mui/material'

const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={{
        nav: {
          padding: 0,
        },
      }}
    />
  )
}

export default GlobalStyles
