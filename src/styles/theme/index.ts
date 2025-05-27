import type { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material'

import { breakpoints } from './breakpoints'
import { components } from './components'
import { palette } from './palette'
import { height, width } from './size'
import { typography } from './typography'
import { zIndex } from './zIndex'

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
