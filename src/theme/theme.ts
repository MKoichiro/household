import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material";
import { amber, blue, cyan, deepOrange, green, lightBlue, lightGreen, pink, purple, red } from "@mui/material/colors";
import { ExpenseCategory, IncomeCategory } from "../types";

declare module "@mui/material/styles" {
  interface Palette {
    incomeColor: PaletteColor;
    expenseColor: PaletteColor;
    balanceColor: PaletteColor;

    incomeCategoryColor: Record<IncomeCategory, PaletteColor>;
    expenseCategoryColor: Record<ExpenseCategory, PaletteColor>;
  }

  interface PaletteOptions {
    incomeColor: PaletteColorOptions;
    expenseColor: PaletteColorOptions;
    balanceColor: PaletteColorOptions;

    incomeCategoryColor: Record<IncomeCategory, PaletteColorOptions>;
    expenseCategoryColor: Record<ExpenseCategory, PaletteColorOptions>;
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
    },
  },

  palette: {
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
      "給与": { main: lightBlue[600], dark: lightBlue[900]},
      "副収入": { main: cyan[200], dark: cyan[800]},
      "お小遣い": { main: lightGreen["A700"], dark: lightGreen[700]},
    },
    expenseCategoryColor: {
      "食費": { main: deepOrange[500], dark: deepOrange[900]},
      "日用品": { main: lightGreen[500], dark: lightGreen[900]},
      "住居費": { main: amber[500], dark: amber[900]},
      "交際費": { main: pink[300], dark: pink[700]},
      "娯楽": { main: cyan[200], dark: cyan[800]},
      "交通費": { main: purple[300], dark: purple[800]},
    },
  },
})
