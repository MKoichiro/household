import type { Breakpoint } from '@mui/material'
import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * 現在のブレイクポイントを返すカスタムフック
 */
export const useBreakpoint = (): {
  bp: Breakpoint
  isUp: { sm: boolean; md: boolean; lg: boolean; xl: boolean }
  isDown: { xs: boolean; sm: boolean; md: boolean; lg: boolean }
} => {
  const theme = useTheme()

  const isUpXl = useMediaQuery(theme.breakpoints.up('xl'))
  const isUpLg = useMediaQuery(theme.breakpoints.up('lg'))
  const isUpMd = useMediaQuery(theme.breakpoints.up('md'))
  const isUpSm = useMediaQuery(theme.breakpoints.up('sm'))

  const isDownXs = useMediaQuery(theme.breakpoints.down('xs'))
  const isDownSm = useMediaQuery(theme.breakpoints.down('sm'))
  const isDownMd = useMediaQuery(theme.breakpoints.down('md'))
  const isDownLg = useMediaQuery(theme.breakpoints.down('lg'))

  const bp = () => {
    if (isUpXl) return 'xl'
    if (isUpLg) return 'lg'
    if (isUpMd) return 'md'
    if (isUpSm) return 'sm'
    return 'xs'
  }

  return {
    bp: bp(),
    isUp: { sm: isUpSm, md: isUpMd, lg: isUpLg, xl: isUpXl },
    isDown: { xs: isDownXs, sm: isDownSm, md: isDownMd, lg: isDownLg },
  }
}
