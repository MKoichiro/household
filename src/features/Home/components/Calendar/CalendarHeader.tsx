import { Box, Button, IconButton, Typography } from '@mui/material'
import { format } from 'date-fns'
import { ArrowBackIosNewIcon, ArrowForwardIosIcon, TodayIcon } from '../../../../icons'

interface CalendarHeaderProps {
  currentMonth: Date
  handlePrevMonthClick: () => void
  handleTodayClick: () => void
  handleNextMonthClick: () => void
}

const CalendarHeader = ({
  currentMonth,
  handlePrevMonthClick,
  handleTodayClick,
  handleNextMonthClick,
}: CalendarHeaderProps) => {
  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 2,
      }}
    >
      <Typography component="h1" variant="h5" sx={{ color: (theme) => theme.palette.app.main }}>
        {format(currentMonth, 'yyyy年 M月')}
      </Typography>

      <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
        <IconButton
          aria-label="前月へ移動するボタン"
          onClick={handlePrevMonthClick}
          sx={{ color: (theme) => theme.palette.app.main }}
        >
          <ArrowBackIosNewIcon />
        </IconButton>

        <Button
          aria-label="今日の日付へ移動するボタン"
          startIcon={<TodayIcon />}
          onClick={handleTodayClick}
          sx={{
            color: (theme) => theme.palette.app.main,
          }}
        >
          Today
        </Button>
        <IconButton
          aria-label="翌月へ移動するボタン"
          onClick={handleNextMonthClick}
          sx={{ color: (theme) => theme.palette.app.main }}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CalendarHeader
