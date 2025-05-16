import { GlobalStyles as MUIGlobalStyles } from '@mui/material'

const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={(theme) => ({
        html: {
          // xl, lg
          fontSize: '62.5%',
          // md
          [theme.breakpoints.down('md')]: {
            fontSize: '56.25%', // =9px
          },
          // sm, xs
          [theme.breakpoints.down('sm')]: {
            fontSize: '50%', // =8px
          },
        },
        nav: {
          padding: 0,
        },
      })}
    />
  )
}

export default GlobalStyles
