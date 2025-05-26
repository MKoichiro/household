import { Breakpoint, css, Theme } from '@mui/material'

// 1rem の定義、theme の typography を使うと何かしら不都合があったため GlobalStyles で適用
export const htmlFontSizes: Record<Breakpoint, number> = {
  xl: 62.5,
  lg: 62.5,
  md: 56.25,
  sm: 43.75,
  xs: 43.75,
}

// 各ページの layout レベルで適用する padding
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
  padding: ${pagePadding['xs']};

  ${theme.breakpoints.up('sm')} {
    padding: ${pagePadding['sm']};
  }
  ${theme.breakpoints.up('md')} {
    padding: ${pagePadding['md']};
  }
  ${theme.breakpoints.up('lg')} {
    padding: ${pagePadding['lg']};
  }
  ${theme.breakpoints.up('xl')} {
    padding: ${pagePadding['xl']};
  }
`
