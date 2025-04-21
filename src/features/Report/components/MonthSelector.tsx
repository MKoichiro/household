import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { Box, Button } from '@mui/material'
import { ja } from 'date-fns/locale'
import { addMonths } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'

export interface MonthSelectorProps {
  selectedMonth: Date
  setSelectedMonth: Dispatch<SetStateAction<Date>>
}

const MonthSelector = ({ selectedMonth, setSelectedMonth }: MonthSelectorProps) => {
  const handlePrevClick = () => {
    const prevMonth = addMonths(selectedMonth, -1)
    setSelectedMonth(prevMonth)
  }

  const handleNextClick = () => {
    const nextMonth = addMonths(selectedMonth, +1)
    setSelectedMonth(nextMonth)
  }

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setSelectedMonth(newDate)
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button color={'error'} variant="contained" onClick={handlePrevClick}>
          先月
        </Button>
        <DatePicker
          sx={{ mx: 2, background: 'white' }}
          label="年月を選択"
          defaultValue={selectedMonth} // 単なる初期値
          value={selectedMonth} // 外部から変更可
          views={['year', 'month']} // 年 -> 月で選択
          openTo="month" // 月選択を最初に開く
          format="yyyy/MM"
          slotProps={{
            calendarHeader: { format: 'yyyy年MM月' }, // 選択部分の直上部。デスクトップ版とモバイル版
            toolbar: { toolbarFormat: 'yyyy年MM月' }, // 最上部。モバイル版のみ。
            // actionbar: {}, // モバイル版のみ。最下部のボタン種(OK, CANCELなど)をカスタムできる。
          }}
          onChange={handleDateChange}
        />
        <Button color={'primary'} variant="contained" onClick={handleNextClick}>
          翌月
        </Button>
      </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector
