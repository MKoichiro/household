import { Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

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
      }}
      aria-label="家計簿アプリ ホームへ"
    >
      家計簿アプリ
    </Typography>
  )
}

export default HeaderTitle
