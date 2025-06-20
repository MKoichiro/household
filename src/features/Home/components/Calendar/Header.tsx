import { Box, Button, Typography } from '@mui/material'
import { format } from 'date-fns'

import { TodayIcon } from '@icons'
import { cpf } from '@styles/theme/helpers/colorPickers'
import MonthNavButton from '@ui/MonthNavButton'

interface CalendarHeaderProps {
  homeMonth: Date
  handlePrevMonthClick: () => void
  handleTodayClick: () => void
  handleNextMonthClick: () => void
}

const CalendarHeader = ({
  homeMonth,
  handlePrevMonthClick,
  handleTodayClick,
  handleNextMonthClick,
}: CalendarHeaderProps) => {
  return (
    <Box component="header" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography component="h1" variant="h5" sx={{ color: cpf('app.lighterBg.level1.contrastText') }}>
        {format(homeMonth, 'yyyy年 M月')}
      </Typography>

      <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
        <MonthNavButton direction="PREV" onClick={handlePrevMonthClick} />
        <Button
          aria-label="今日の日付へ移動するボタン"
          startIcon={<TodayIcon />}
          onClick={handleTodayClick}
          sx={{ color: cpf('app.lighterBg.level1.contrastText') }}
        >
          Today
        </Button>
        <MonthNavButton direction="NEXT" onClick={handleNextMonthClick} />
      </Box>
    </Box>
  )
}

export default CalendarHeader
