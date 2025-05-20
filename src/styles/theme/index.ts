import { Breakpoint, createTheme, PaletteColor, PaletteColorOptions, PaletteMode } from '@mui/material'
import { ExpenseCategory, IncomeCategory } from '../../shared/types'
import { typography } from './typography'
import { components } from './components'
import { breakpoints } from './breakpoints'
import { palette } from './palette'
import { zIndex } from './zIndex'

declare module '@mui/material/styles' {
  interface Palette {
    appTheme: PaletteColor
    appBg: {
      level1: PaletteColor
      level2: PaletteColor
      level3: PaletteColor
      level4: PaletteColor
    }

    ui: {
      header: { bg: PaletteColor }
      bodyBg: PaletteColor
      navMenu: { bg: PaletteColor }
      contextMenu: { bg: PaletteColor }
      calendar: {
        head: { bg: PaletteColor; font: PaletteColor }
      }
      snackBar: {
        success: { icon: PaletteColor; bg: PaletteColor }
        error: { icon: PaletteColor; bg: PaletteColor }
        info: { icon: PaletteColor; bg: PaletteColor }
        warning: { icon: PaletteColor; bg: PaletteColor }
        closeBtn: PaletteColor
        // default: { icon: PaletteColor; bg: PaletteColor }
      }
    }

    incomeColor: PaletteColor
    expenseColor: PaletteColor
    balanceColor: PaletteColor
    incomeCategoryColor: Record<IncomeCategory, PaletteColor>
    expenseCategoryColor: Record<ExpenseCategory, PaletteColor>
  }

  interface PaletteOptions {
    appTheme: PaletteColorOptions
    appBg: {
      level1: PaletteColorOptions
      level2: PaletteColorOptions
      level3: PaletteColorOptions
      level4: PaletteColorOptions
    }

    ui: {
      header: { bg: PaletteColorOptions }
      bodyBg: PaletteColorOptions
      navMenu: { bg: PaletteColorOptions }
      contextMenu: { bg: PaletteColorOptions }
      calendar: {
        head: { bg: PaletteColorOptions; font: PaletteColorOptions }
      }
      snackBar: {
        success: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        error: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        info: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        warning: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        closeBtn: PaletteColorOptions
        // default: { icon: PaletteColorOptions; bg: PaletteColorOptions }
      }
    }

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
    contextMenu: Record<Breakpoint, number>
    notificationPad: Record<Breakpoint, number>
  }
}

// export const theme = createTheme({
//   typography,
//   components,
//   breakpoints,
//   palette,
//   zIndex,
// })

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    typography,
    components,
    breakpoints,
    palette: {
      mode, // ← ここを追加
      ...palette, // 既存のカラー定義を展開
    },
    zIndex,
  })
