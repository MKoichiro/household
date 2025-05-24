import { Breakpoint, useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'

/**
 * 現在のブレイクポイントを返すカスタムフック
 */
export const useBreakpoint = (): Breakpoint => {
  const theme = useTheme()

  // フックは必ずトップレベルで呼び出す
  const isXl = useMediaQuery(theme.breakpoints.up('xl'))
  const isLg = useMediaQuery(theme.breakpoints.up('lg'))
  const isMd = useMediaQuery(theme.breakpoints.up('md'))
  const isSm = useMediaQuery(theme.breakpoints.up('sm'))

  // 判定は後から
  if (isXl) return 'xl'
  if (isLg) return 'lg'
  if (isMd) return 'md'
  if (isSm) return 'sm'
  return 'xs'
}
