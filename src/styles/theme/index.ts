import { createTheme, PaletteMode } from '@mui/material'
import { typography } from './typography'
import { components } from './components'
import { breakpoints } from './breakpoints'
import { palette } from './palette'
import { zIndex } from './zIndex'
import { height, width } from './size'

// getTheme をかませ、theme を受け取るようにすることで、ダークモード/ライトモード対応
export const getTheme = (mode: PaletteMode) =>
  createTheme({
    typography,
    components,
    breakpoints,
    palette: { mode, ...palette },
    zIndex,
    width,
    height,
  })
