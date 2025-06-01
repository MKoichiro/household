import type { Breakpoint, PaletteColor, PaletteColorOptions } from '@mui/material'
import type { CSSProperties } from 'react'

import type { ExpenseCategory, IncomeCategory } from '@shared/types'

type WidthOptions = Record<Breakpoint, NonNullable<CSSProperties['width']>>
type HeightOptions = Record<Breakpoint, NonNullable<CSSProperties['height']>>

declare module '@mui/material/styles' {
  interface Palette {
    app: {
      theme: { bg: PaletteColor; contrastText: PaletteColor }
      lighterBg: {
        level1: { bg: PaletteColor; contrastText: PaletteColor }
        level2: { bg: PaletteColor; contrastText: PaletteColor }
        level3: { bg: PaletteColor; contrastText: PaletteColor }
        level4: { bg: PaletteColor; contrastText: PaletteColor }
        level5: { bg: PaletteColor; contrastText: PaletteColor }
      }
      darkerBg: {
        level1: { bg: PaletteColor; contrastText: PaletteColor }
        level2: { bg: PaletteColor; contrastText: PaletteColor }
        level3: { bg: PaletteColor; contrastText: PaletteColor }
        level4: { bg: PaletteColor; contrastText: PaletteColor }
        level5: { bg: PaletteColor; contrastText: PaletteColor }
      }
    }

    ui: {
      header: { bg: PaletteColor; contrastText: PaletteColor }
      headerNews: { bg: PaletteColor; contrastText: PaletteColor }
      bodyBg: PaletteColor
      footer: { bg: PaletteColor; contrastText: PaletteColor }
      mask: PaletteColor
      navigationMenu: {
        bodyBg: PaletteColor
        item: {
          inactive: { bg: PaletteColor; font: PaletteColor }
          hover: { bg: PaletteColor; font: PaletteColor }
          active: { bg: PaletteColor; font: PaletteColor }
        }
        accordionHead: {
          inactive: { bg: PaletteColor; font: PaletteColor }
          hover: { bg: PaletteColor; font: PaletteColor }
          active: { bg: PaletteColor; font: PaletteColor }
        }
      }
      contextMenu: { bg: PaletteColor; contrastText: PaletteColor }
      calendar: {
        head: {
          bg: {
            weekday: PaletteColor
            saturday: PaletteColor
            sunday: PaletteColor
          }
          font: {
            weekday: PaletteColor
            saturday: PaletteColor
            sunday: PaletteColor
          }
          border: {
            weekday: PaletteColor
            saturday: PaletteColor
            sunday: PaletteColor
          }
        }
        cells: {
          bg: {
            weekday: PaletteColor
            saturday: PaletteColor
            sunday: PaletteColor
            today: PaletteColor
            selected: PaletteColor
          }
          font: {
            weekday: PaletteColor
            saturday: PaletteColor
            sunday: PaletteColor
            today: PaletteColor
            selected: PaletteColor
          }
          border: {
            weekday: PaletteColor
            saturday: PaletteColor
            sunday: PaletteColor
            today: PaletteColor
            selected: PaletteColor
          }
        }
        mask: PaletteColor
      }
      snackBar: {
        success: { icon: PaletteColor; bg: PaletteColor }
        error: { icon: PaletteColor; bg: PaletteColor }
        info: { icon: PaletteColor; bg: PaletteColor }
        warning: { icon: PaletteColor; bg: PaletteColor }
        closeBtn: PaletteColor
      }
      monthlySummary: { bg: PaletteColor }
      dailySummary: { bg: PaletteColor }
      aiAdvisor: {
        bg: PaletteColor
        contrastText: PaletteColor
        gradations: {
          start: PaletteColor
          end: PaletteColor
        }
      }
    }

    income: {
      bg: {
        lighter: PaletteColor
        darker: PaletteColor // chart, ...etc
      }
      font: { lighter: PaletteColor; darker: PaletteColor }
      border: PaletteColor
    }
    expense: {
      bg: { lighter: PaletteColor; darker: PaletteColor }
      font: { lighter: PaletteColor; darker: PaletteColor }
      border: PaletteColor
    }
    balance: {
      bg: { lighter: PaletteColor; darker: PaletteColor }
      font: { lighter: PaletteColor; darker: PaletteColor }
      border: PaletteColor
    }
    incomeCategory: Record<IncomeCategory, PaletteColor>
    expenseCategory: Record<ExpenseCategory, PaletteColor>
  }

  interface PaletteOptions {
    app: {
      theme: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
      lighterBg: {
        level1: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level2: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level3: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level4: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level5: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
      }
      darkerBg: {
        level1: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level2: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level3: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level4: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
        level5: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
      }
    }

    ui: {
      header: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
      headerNews: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
      bodyBg: PaletteColorOptions
      footer: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
      mask: PaletteColorOptions
      navigationMenu: {
        bodyBg: PaletteColorOptions
        item: {
          inactive: { bg: PaletteColorOptions; font: PaletteColorOptions }
          hover: { bg: PaletteColorOptions; font: PaletteColorOptions }
          active: { bg: PaletteColorOptions; font: PaletteColorOptions }
        }
        accordionHead: {
          inactive: { bg: PaletteColorOptions; font: PaletteColorOptions }
          hover: { bg: PaletteColorOptions; font: PaletteColorOptions }
          active: { bg: PaletteColorOptions; font: PaletteColorOptions }
        }
      }
      contextMenu: { bg: PaletteColorOptions; contrastText: PaletteColorOptions }
      calendar: {
        head: {
          bg: {
            weekday: PaletteColorOptions
            saturday: PaletteColorOptions
            sunday: PaletteColorOptions
          }
          font: {
            weekday: PaletteColorOptions
            saturday: PaletteColorOptions
            sunday: PaletteColorOptions
          }
          border: {
            weekday: PaletteColorOptions
            saturday: PaletteColorOptions
            sunday: PaletteColorOptions
          }
        }
        cells: {
          bg: {
            weekday: PaletteColorOptions
            saturday: PaletteColorOptions
            sunday: PaletteColorOptions
            today: PaletteColorOptions
            selected: PaletteColorOptions
          }
          font: {
            weekday: PaletteColorOptions
            saturday: PaletteColorOptions
            sunday: PaletteColorOptions
            today: PaletteColorOptions
            selected: PaletteColorOptions
          }
          border: {
            weekday: PaletteColorOptions
            saturday: PaletteColorOptions
            sunday: PaletteColorOptions
            today: PaletteColorOptions
            selected: PaletteColorOptions
          }
        }
        mask: PaletteColorOptions
      }
      snackBar: {
        success: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        error: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        info: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        warning: { icon: PaletteColorOptions; bg: PaletteColorOptions }
        closeBtn: PaletteColorOptions
      }
      monthlySummary: { bg: PaletteColorOptions }
      dailySummary: { bg: PaletteColorOptions }
      aiAdvisor: {
        bg: PaletteColorOptions
        contrastText: PaletteColorOptions
        gradations: {
          start: PaletteColorOptions
          end: PaletteColorOptions
        }
      }
    }

    income: {
      bg: {
        lighter: PaletteColorOptions
        darker: PaletteColorOptions // chart, ...etc
      }
      font: { lighter: PaletteColorOptions; darker: PaletteColorOptions }
      border: PaletteColorOptions
    }
    expense: {
      bg: { lighter: PaletteColorOptions; darker: PaletteColorOptions }
      font: { lighter: PaletteColorOptions; darker: PaletteColorOptions }
      border: PaletteColorOptions
    }
    balance: {
      bg: { lighter: PaletteColorOptions; darker: PaletteColorOptions }
      font: { lighter: PaletteColorOptions; darker: PaletteColorOptions }
      border: PaletteColorOptions
    }
    incomeCategory: Record<IncomeCategory, PaletteColorOptions>
    expenseCategory: Record<ExpenseCategory, PaletteColorOptions>
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

  interface Width {
    navigationMenu: WidthOptions
    transactionMenu: WidthOptions
  }

  interface Height {
    header: HeightOptions
    headerNews: HeightOptions
    footer: HeightOptions
  }

  // Theme 拡張部分
  interface Theme {
    width: Width
    height: Height
  }
  interface ThemeOptions {
    width: Width
    height: Height
  }
}
