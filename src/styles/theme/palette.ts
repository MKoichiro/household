import { PaletteColorOptions, PaletteOptions } from '@mui/material'
import * as c from '@mui/material/colors'

const appThemeColors: PaletteColorOptions = { main: c.purple[900], light: c.purple[900], dark: c.purple[900] }

const appBgColors = {
  level1: { main: c.blueGrey[200], light: c.blueGrey[200], dark: c.blueGrey[900] },
  level2: { main: c.blueGrey[300], light: c.blueGrey[300], dark: c.blueGrey[800] },
  level3: { main: c.blueGrey[400], light: c.blueGrey[400], dark: c.blueGrey[700] },
  level4: { main: c.blueGrey[500], light: c.blueGrey[500], dark: c.blueGrey[600] },
}

export const palette: PaletteOptions = {
  appTheme: appThemeColors,
  appBg: appBgColors,
  ui: {
    header: {
      bg: { main: c.purple[900], light: c.deepPurple[900], dark: c.deepPurple[900] },
    },
    bodyBg: {
      // main ,
      // light ,
      // dark ,
    },
    navMenu: {
      bg: {
        // main ,
        // light ,
        // dark ,
      },
    },
    contextMenu: {
      bg: {
        // main ,
        // light ,
        // dark ,
      },
    },
    calendar: {
      head: {
        bg: { main: c.grey[50], light: c.purple[900], dark: c.purple[900] },
        font: { main: c.purple[900], light: c.purple[900], dark: c.purple[900] },
      },
    },
    snackBar: {
      success: {
        icon: { main: c.teal['A700'], light: c.teal['A700'], dark: c.teal['A200'] },
        bg: { main: c.green[50], light: c.green[50], dark: c.green[700] },
      },
      error: {
        icon: { main: c.pink['A400'], light: c.pink['A400'], dark: c.pink[200] },
        bg: { main: c.red[50], light: c.red[50], dark: c.pink['A700'] },
      },
      info: {
        icon: { main: c.lightBlue[400], light: c.lightBlue[400], dark: c.cyan['A200'] },
        bg: { main: c.blue[50], light: c.blue[50], dark: c.blue[700] },
      },
      warning: {
        icon: { main: c.yellow[800], light: c.yellow[800], dark: c.amber[600] },
        bg: { main: c.amber[50], light: c.amber[50], dark: c.orange[800] },
      },
      closeBtn: { main: c.blueGrey[500], light: c.blueGrey[500], dark: c.blueGrey[50] },
      // default: {
      //   icon: { main: c.grey[500], light: c.grey[100], dark: c.grey[700] },
      //   bg: { main: c.grey[500], light: c.grey[100], dark: c.grey[700] },
      // },
    },
  },

  incomeColor: { main: c.blue[500], light: c.blue[100], dark: c.blue[700] },
  expenseColor: { main: c.red[500], light: c.red[100], dark: c.red[700] },
  balanceColor: { main: c.green[300], light: c.green[100], dark: c.green[500] },

  incomeCategoryColor: {
    給与: { main: c.lightBlue[600], dark: c.lightBlue[900] },
    副収入: { main: c.cyan[200], dark: c.cyan[800] },
    お小遣い: { main: c.lightGreen['A700'], dark: c.lightGreen[700] },
  },
  expenseCategoryColor: {
    食費: { main: c.deepOrange[500], dark: c.deepOrange[900] },
    日用品: { main: c.lightGreen[500], dark: c.lightGreen[900] },
    住居費: { main: c.amber[500], dark: c.amber[900] },
    交際費: { main: c.pink[300], dark: c.pink[700] },
    娯楽: { main: c.cyan[200], dark: c.cyan[800] },
    交通費: { main: c.purple[300], dark: c.purple[800] },
  },
}
