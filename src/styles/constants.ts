import { Breakpoint, css, Theme } from '@mui/material'

export const htmlFontSizes: Record<Breakpoint, number> = {
  xl: 62.5,
  lg: 62.5,
  md: 56.25,
  sm: 43.75,
  xs: 43.75,
}

export const pagePaddingY: Record<Breakpoint, string> = {
  xs: '1.6rem',
  sm: '1.6rem',
  md: '1.6rem',
  lg: '2rem',
  xl: '2.2rem',
}

export const pagePaddingX: Record<Breakpoint, string> = {
  xs: '0.6rem',
  sm: '0.8rem',
  md: '0.4rem',
  lg: '0.8rem',
  xl: '1rem',
}

export const pagePadding: Record<Breakpoint, string> = {
  xs: `${pagePaddingY.xs} ${pagePaddingX.xs}`,
  sm: `${pagePaddingY.sm} ${pagePaddingX.sm}`,
  md: `${pagePaddingY.md} ${pagePaddingX.md}`,
  lg: `${pagePaddingY.lg} ${pagePaddingX.lg}`,
  xl: `${pagePaddingY.xl} ${pagePaddingX.xl}`,
}

export const pagePaddingTemplate = (theme: Theme) => css`
  padding: ${pagePadding['xl']};
  ${theme.breakpoints.down('lg')} {
    padding: ${pagePadding['lg']};
  }
  ${theme.breakpoints.down('md')} {
    padding: ${pagePadding['md']};
  }
  ${theme.breakpoints.down('sm')} {
    padding: ${pagePadding['sm']};
  }
  ${theme.breakpoints.down('xs')} {
    padding: ${pagePadding['xs']};
  }
`
