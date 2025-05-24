import { GlobalStyles as MUIGlobalStyles } from '@mui/material'
import { htmlFontSizes } from './constants'

const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={(theme) => ({
        html: {
          fontSize: `${htmlFontSizes.xl}%`,
          [theme.breakpoints.down('lg')]: { fontSize: `${htmlFontSizes.lg}%` },
          [theme.breakpoints.down('md')]: { fontSize: `${htmlFontSizes.md}%` },
          [theme.breakpoints.down('sm')]: { fontSize: `${htmlFontSizes.sm}%` },
          [theme.breakpoints.down('xs')]: { fontSize: `${htmlFontSizes.xs}%` },
        },
        nav: {
          padding: 0,
        },
        ul: {
          padding: 0,
          margin: 0,
          listStyle: 'none',
        },
        dl: {
          padding: 0,
          margin: 0,
        },
      })}
    />
  )
}

export default GlobalStyles
