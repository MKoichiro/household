import type { TypographyVariantsOptions } from '@mui/material'

export const FONT_FAMILY = {
  PRIMARY: 'Noto Sans JP, Roboto, Helvetica Neue, Arial, sans-serif',
  APP_LOGO: 'Economica, Noto Sans JP, Roboto, Helvetica Neue, Arial, sans-serif',
}

export const typography: TypographyVariantsOptions = {
  fontFamily: FONT_FAMILY.PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: { fontSize: '3.2rem', fontWeight: 700 },
  h2: { fontSize: '3.0rem', fontWeight: 700 },
  h3: { fontSize: '2.8rem', fontWeight: 700 },
  h4: { fontSize: '2.4rem', fontWeight: 500 },
  h5: { fontSize: '2.2rem', fontWeight: 500 },
  h6: { fontSize: '2.0rem', fontWeight: 500 },
  subtitle1: { fontSize: '1.8rem', fontWeight: 500 },
  subtitle2: { fontSize: '1.6rem', fontWeight: 500 },
  body1: { fontSize: '1.6rem', fontWeight: 400 },
  body2: { fontSize: '1.2rem', fontWeight: 400 },
  button: { fontSize: '1.4rem', fontWeight: 400 },
  caption: { fontSize: '1.2rem', fontWeight: 400 },
  overline: { fontSize: '1.2rem', fontWeight: 400 },
}
