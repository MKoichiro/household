import type { Breakpoint, Theme } from '@mui/material'

const mediaqueryPicker =
  (direction: 'up' | 'down', breakpoint: Breakpoint) =>
  (theme: Theme): string => {
    const value = theme.breakpoints.values[breakpoint]
    if (value === undefined) {
      throw new Error(`mediaqueryPicker: theme.breakpoints.values の中に "${breakpoint}" が見つかりません`)
    }

    return theme.breakpoints[direction](value)
  }

export { mediaqueryPicker as mqp }
