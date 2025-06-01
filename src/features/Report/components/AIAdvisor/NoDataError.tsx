import { Typography, useTheme } from '@mui/material'
import { NavLink } from 'react-router-dom'

import * as colorPickers from '@styles/theme/helpers/colorPickers'

const NoDataError = () => {
  const theme = useTheme()
  return (
    <>
      <Typography variant="body1" color="text.secondary">
        データがありません。まずは
        <NavLink
          to="/app/home"
          style={{
            color: colorPickers.cp(theme, 'app.lighterBg.level1.contrastText'),
            fontWeight: 'bold',
            textDecoration: 'none',
            padding: '0 0.5rem',
          }}
        >
          ホーム
        </NavLink>
        から取引を追加してください。
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: '0.8rem' }}>
        取引を追加すると、AI アドバイザーが自動的にデータを分析し、提案を生成します。
      </Typography>
    </>
  )
}

export default NoDataError
