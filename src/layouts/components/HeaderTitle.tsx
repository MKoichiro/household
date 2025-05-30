import { Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { APP_NAME } from '@shared/constants/app'
import { FONT_FAMILY } from '@styles/theme/typography'

type HeaderTitleProps = {
  redirectTo?: string
}

const HeaderTitle = ({ redirectTo }: HeaderTitleProps) => {
  const noLink = redirectTo === undefined
  return (
    <Typography
      variant="h6"
      noWrap
      component={noLink ? 'div' : RouterLink}
      to={noLink ? undefined : redirectTo}
      replace={!noLink}
      sx={{
        color: 'white',
        textDecoration: 'none',
        textTransform: 'none',
        '&:hover': !noLink ? { opacity: 0.8 } : undefined,
        cursor: noLink ? 'default' : 'pointer',
        fontFamily: FONT_FAMILY.APP_LOGO,
        fontWeight: 700,
        letterSpacing: '0.08em',
        fontSize: '2.4rem',
      }}
      aria-label={`${APP_NAME.DISPLAY} ホームへ`}
    >
      {APP_NAME.DISPLAY}
    </Typography>
  )
}

export default HeaderTitle
