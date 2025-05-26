import { PaletteColorOptions, PaletteOptions, alpha } from '@mui/material'
import * as c from '@mui/material/colors'

const undefinedYet: PaletteColorOptions = { main: '', light: '', dark: '' }

const appTheme = {
  bg: { main: c.blueGrey[600], light: c.blueGrey[600], dark: c.blueGrey[600] },
  contrastText: { main: c.grey[50], light: c.grey[50], dark: c.grey[50] },
}

const app = {
  theme: appTheme,
  lighterBg: {
    level1: {
      bg: { main: c.grey[50], light: c.blueGrey[50], dark: '#151b1f' },
      contrastText: { main: c.blueGrey[900], light: c.blueGrey[900], dark: c.blueGrey[100] },
    },
    level2: {
      // bg: { main: c.indigo[50], light: '#e4e9ed', dark: c.grey[900] },
      bg: { main: c.indigo[50], light: c.grey[100], dark: '#191919' },
      contrastText: { main: c.blueGrey[800], light: c.blueGrey[800], dark: c.blueGrey[200] },
    },
    level3: {
      bg: { main: c.blueGrey[50], light: c.grey[50], dark: c.blueGrey[900] },
      contrastText: { main: c.blueGrey[900], light: c.blueGrey[900], dark: c.blueGrey[100] },
    },
    level4: {
      bg: undefinedYet,
      contrastText: undefinedYet,
    },
    level5: {
      bg: undefinedYet,
      contrastText: undefinedYet,
    },
  },
  darkerBg: {
    level1: {
      bg: { main: c.blueGrey[900], light: c.blueGrey[900], dark: c.blueGrey[50] },
      contrastText: { main: c.blueGrey[50], light: c.blueGrey[50], dark: c.blueGrey[900] },
    },
    level2: {
      bg: { main: c.blueGrey[700], light: c.blueGrey[700], dark: c.blueGrey[100] },
      contrastText: { main: c.blueGrey[100], light: c.blueGrey[100], dark: c.blueGrey[700] },
    },
    level3: {
      bg: { main: c.blueGrey[700], light: c.blueGrey[700], dark: c.blueGrey[200] },
      contrastText: { main: c.blueGrey[700], light: c.blueGrey[700], dark: c.blueGrey[300] },
    },
    level4: {
      bg: undefinedYet,
      contrastText: undefinedYet,
    },
    level5: {
      bg: undefinedYet,
      contrastText: undefinedYet,
    },
  },
}

export const palette: PaletteOptions = {
  app,

  ui: {
    header: app.theme,
    headerNews: app.darkerBg.level2,
    bodyBg: app.lighterBg.level1.bg,
    footer: app.theme,
    mask: {
      main: `${alpha(c.blueGrey[900], 0.3)}`,
      light: `${alpha(c.blueGrey[900], 0.3)}`,
      dark: `${alpha(c.blueGrey[900], 0.3)}`,
    },
    navigationMenu: {
      bodyBg: { main: '', light: c.blueGrey[100], dark: c.blueGrey[900] },
      item: {
        inactive: {
          bg: undefinedYet,
          font: app.lighterBg.level1.contrastText,
        },
        hover: {
          bg: app.darkerBg.level2.bg,
          font: app.darkerBg.level2.contrastText,
        },
        active: {
          bg: app.darkerBg.level1.bg,
          font: app.darkerBg.level1.contrastText,
        },
      },
      accordionHead: {
        inactive: {
          bg: undefinedYet,
          font: undefinedYet,
        },
        hover: {
          bg: undefinedYet,
          font: app.darkerBg.level2.bg,
        },
        active: {
          bg: undefinedYet,
          font: undefinedYet,
        },
      },
    },
    contextMenu: app.theme,
    calendar: {
      head: {
        bg: {
          weekday: app.lighterBg.level3.bg,
          saturday: app.lighterBg.level3.bg,
          sunday: app.lighterBg.level3.bg,
        },
        font: {
          weekday: app.lighterBg.level3.contrastText,
          saturday: { main: c.cyan[600], light: c.cyan[600], dark: c.cyan[300] },
          sunday: { main: c.pink[500], light: c.pink[500], dark: c.pink[300] },
        },
        border: {
          weekday: {
            main: `1px solid ${c.blueGrey[100]}`,
            light: `1px solid ${c.blueGrey[100]}`,
            dark: `1px solid ${c.blueGrey[900]}`,
          },
          saturday: {
            main: `1px solid ${c.blueGrey[100]}`,
            light: `1px solid ${c.blueGrey[100]}`,
            dark: `1px solid ${c.blueGrey[900]}`,
          },
          sunday: {
            main: `1px solid ${c.blueGrey[100]}`,
            light: `1px solid ${c.blueGrey[100]}`,
            dark: `1px solid ${c.blueGrey[900]}`,
          },
        },
      },
      cells: {
        bg: {
          weekday: app.lighterBg.level2.bg,
          saturday: { main: c.cyan[50], light: c.cyan[50], dark: '#00191a' },
          sunday: { main: c.pink[50], light: c.pink[50], dark: '#26171f' },
          today: { main: '', light: c.purple[50], dark: c.purple[900] },
          selected: undefinedYet,
        },
        font: {
          weekday: app.lighterBg.level1.contrastText,
          saturday: app.lighterBg.level1.contrastText,
          sunday: app.lighterBg.level1.contrastText,
          today: undefinedYet,
          selected: undefinedYet,
        },
        border: {
          weekday: {
            main: `1px solid ${c.blueGrey[100]}`,
            light: `1px solid ${c.blueGrey[100]}`,
            dark: `1px solid ${c.blueGrey[900]}`,
          },
          saturday: {
            main: `1px solid ${c.blueGrey[100]}`,
            light: `1px solid ${c.blueGrey[100]}`,
            dark: `1px solid ${c.blueGrey[900]}`,
          },
          sunday: {
            main: `1px solid ${c.blueGrey[100]}`,
            light: `1px solid ${c.blueGrey[100]}`,
            dark: `1px solid ${c.blueGrey[900]}`,
          },
          today: undefinedYet,
          selected: {
            main: `1px solid ${c.indigo[900]}`,
            light: `1px solid ${c.indigo[900]}`,
            dark: `1px solid ${c.indigo[50]}`,
          },
        },
      },
      mask: app.lighterBg.level2.bg,
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
    },
    monthlySummary: {
      bg: app.lighterBg.level2.bg,
    },
    dailySummary: {
      bg: app.lighterBg.level3.bg,
    },
  },

  income: {
    bg: {
      lighter: { main: c.blue[50], light: c.blue[100], dark: '#002440' },
      darker: { main: c.blue[500], light: c.blue[500], dark: c.indigo[200] },
    },
    font: {
      lighter: { main: c.blue[500], light: c.blue[500], dark: c.indigo[200] },
      darker: { main: c.blue[900], light: c.blue[900], dark: c.indigo[400] },
    },
    border: undefinedYet,
  },
  expense: {
    bg: {
      lighter: { main: c.red[100], light: c.red[100], dark: '#660933' },
      darker: { main: c.red[500], light: c.red[500], dark: c.pink[200] },
    },
    font: {
      lighter: { main: c.red[500], light: c.red[500], dark: c.pink[200] },
      darker: { main: c.red[900], light: c.red[900], dark: c.pink[600] },
    },
    border: undefinedYet,
  },
  balance: {
    bg: {
      lighter: { main: c.green[100], light: c.green[100], dark: c.teal[900] },
      darker: { main: c.green[500], light: c.green[500], dark: c.teal[200] },
    },
    font: {
      lighter: { main: c.green[500], light: c.green[500], dark: c.teal[200] },
      darker: { main: c.green[900], light: c.green[900], dark: c.teal[400] },
    },
    border: undefinedYet,
  },

  incomeCategory: {
    給与: { main: c.lightBlue[600], light: c.lightBlue[600], dark: c.lightBlue[900] },
    副収入: { main: c.cyan[200], light: c.cyan[200], dark: c.cyan[800] },
    お小遣い: { main: c.lightGreen['A700'], light: c.lightGreen['A700'], dark: c.lightGreen[700] },
  },
  expenseCategory: {
    食費: { main: c.deepOrange[500], light: c.deepOrange[500], dark: c.deepOrange[900] },
    日用品: { main: c.lightGreen[500], light: c.lightGreen[500], dark: c.lightGreen[900] },
    住居費: { main: c.amber[500], light: c.amber[500], dark: c.amber[900] },
    交際費: { main: c.pink[300], light: c.pink[300], dark: c.pink[700] },
    娯楽: { main: c.cyan[200], light: c.cyan[200], dark: c.cyan[800] },
    交通費: { main: c.purple[300], light: c.purple[300], dark: c.purple[800] },
  },
}
