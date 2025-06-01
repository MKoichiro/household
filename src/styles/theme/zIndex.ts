import type { ZIndex } from '@mui/material'

export const zIndex: Partial<ZIndex> = {
  // clear default z-index
  mobileStepper: 0,
  fab: 0,
  speedDial: 0,
  appBar: 0,
  drawer: 0,
  modal: 0,
  snackbar: 0,
  tooltip: 0,

  // custom z-index
  header: {
    xs: 1000,
    sm: 1000,
    md: 1000,
    lg: 1200,
    xl: 1200,
  },
  transactionDetail: {
    xs: 1000,
    sm: 1000,
    md: 1000,
    lg: 1100,
    xl: 1100,
  },
  transactionForm: {
    xs: 1100,
    sm: 1100,
    md: 1100,
    lg: 1000,
    xl: 1000,
  },
  navigationMenu: {
    xs: 1400,
    sm: 1400,
    md: 1400,
    lg: 1400,
    xl: 1400,
  },
  contextMenu: {
    xs: 1300,
    sm: 1300,
    md: 1300,
    lg: 1300,
    xl: 1300,
  },
  notificationPad: {
    xs: 2000,
    sm: 2000,
    md: 10000,
    lg: 10000,
    xl: 2000,
  },
}
