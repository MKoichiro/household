import { Components, CssVarsTheme, Theme } from '@mui/material'

export const components: Components<Omit<Theme, 'components' | 'palette'> & CssVarsTheme> = {
  MuiIconButton: {
    styleOverrides: {
      root: {
        fontSize: '2rem',
        '& .MuiSvgIcon-root': {
          fontSize: 'inherit',
        },
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        fontSize: '2rem',
      },
    },
  },
  // デフォルトで、'&:last-child' セレクタで paddingBottom だけ大きめに設定されているので、揃える。
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: '1rem',
        '&:last-child': {
          paddingBottom: '1rem',
        },
      },
    },
  },
}
