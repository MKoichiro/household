import { Breakpoint, createTheme, PaletteColor, PaletteColorOptions } from '@mui/material'
import { amber, blue, cyan, deepOrange, green, lightBlue, lightGreen, pink, purple, red } from '@mui/material/colors'
import { ExpenseCategory, IncomeCategory } from '../../shared/types'

declare module '@mui/material/styles' {
  interface Palette {
    header: PaletteColor

    incomeColor: PaletteColor
    expenseColor: PaletteColor
    balanceColor: PaletteColor

    incomeCategoryColor: Record<IncomeCategory, PaletteColor>
    expenseCategoryColor: Record<ExpenseCategory, PaletteColor>
  }

  interface PaletteOptions {
    header: PaletteColorOptions

    incomeColor: PaletteColorOptions
    expenseColor: PaletteColorOptions
    balanceColor: PaletteColorOptions

    incomeCategoryColor: Record<IncomeCategory, PaletteColorOptions>
    expenseCategoryColor: Record<ExpenseCategory, PaletteColorOptions>
  }

  interface BreakpointOverrides {
    xs: true
    sm: true
    md: true
    lg: true
    xl: true
    // mobile: true
    // tablet: true
    // laptop: true
    // desktop: true
  }

  interface ZIndex {
    header: Record<Breakpoint, number>
    transactionDetail: Record<Breakpoint, number>
    transactionForm: Record<Breakpoint, number>
    navigationMenu: Record<Breakpoint, number>
    notificationPad: Record<Breakpoint, number>
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, Roboto, Helvetica Neue, Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
      // mobile: 0,
      // tablet: 600,
      // laptop: 900,
      // desktop: 1200,
    },
  },

  palette: {
    header: {
      main: purple[900],
      light: purple[900],
      dark: purple[900],
    },

    incomeColor: {
      main: blue[500],
      light: blue[100],
      dark: blue[700],
    },
    expenseColor: {
      main: red[500],
      light: red[100],
      dark: red[700],
    },
    balanceColor: {
      main: green[300],
      light: green[100],
      dark: green[500],
    },

    incomeCategoryColor: {
      給与: { main: lightBlue[600], dark: lightBlue[900] },
      副収入: { main: cyan[200], dark: cyan[800] },
      お小遣い: { main: lightGreen['A700'], dark: lightGreen[700] },
    },
    expenseCategoryColor: {
      食費: { main: deepOrange[500], dark: deepOrange[900] },
      日用品: { main: lightGreen[500], dark: lightGreen[900] },
      住居費: { main: amber[500], dark: amber[900] },
      交際費: { main: pink[300], dark: pink[700] },
      娯楽: { main: cyan[200], dark: cyan[800] },
      交通費: { main: purple[300], dark: purple[800] },
    },
  },

  zIndex: {
    // clear default z-index
    mobileStepper: 0,
    fab: 0,
    speedDial: 0,
    appBar: 0,
    drawer: 0,
    modal: 0,
    snackbar: 0,
    tooltip: 0,
    // set custom z-index
    header: {
      xs: 1000,
      sm: 1000,
      md: 1000,
      lg: 1200,
      xl: 1200,
      // mobile: 1000,
      // tablet: 1000,
      // laptop: 1200,
      // desktop: 1200,
    },
    transactionDetail: {
      xs: 1000,
      sm: 1000,
      md: 1000,
      lg: 1100,
      xl: 1100,
      // mobile: 1000,
      // tablet: 1000,
      // laptop: 1100,
      // desktop: 1100,
    },
    transactionForm: {
      xs: 1100,
      sm: 1100,
      md: 1100,
      lg: 1000,
      xl: 1000,
      // mobile: 1100,
      // tablet: 1100,
      // laptop: 1100,
      // desktop: 1000,
    },
    navigationMenu: {
      xs: 1400,
      sm: 1400,
      md: 1400,
      lg: 1400,
      xl: 1400,
      // mobile: 1400,
      // tablet: 1400,
      // laptop: 1400,
      // desktop: 1400,
    },
    notificationPad: {
      xs: 2000,
      sm: 2000,
      md: 10000,
      lg: 10000,
      xl: 2000,
      // mobile: 2000,
      // tablet: 2000,
      // laptop: 2000,
      // desktop: 2000,
    },
  },
})
