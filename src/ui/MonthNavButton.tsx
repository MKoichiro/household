// 次の（/前の）月に移動するボタン

import { IconButton } from '@mui/material'

import { ArrowBackIosNewIcon, ArrowForwardIosIcon } from '@shared/icons'
import { cpf } from '@styles/theme/helpers/colorPickers'

interface MonthNavButtonProps {
  direction: 'prev' | 'next' | 'PREV' | 'NEXT'
  onClick: () => void
}

const MonthNavButton = ({ direction, onClick }: MonthNavButtonProps) => {
  const isPrev = direction === 'prev' || direction === 'PREV'
  const a11yPrefix = isPrev ? '前月' : '翌月'
  return (
    <IconButton
      aria-label={`${a11yPrefix}へ移動するボタン`}
      onClick={onClick}
      sx={{ color: cpf('app.lighterBg.level1.contrastText') }}
    >
      {isPrev ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
    </IconButton>
  )
}

export default MonthNavButton
