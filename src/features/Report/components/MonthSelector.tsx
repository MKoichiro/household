import { Box } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { addMonths } from 'date-fns'
import { ja } from 'date-fns/locale'
import type { Dispatch, SetStateAction } from 'react'

import MonthNavButton from '@ui/MonthNavButton'

export interface MonthSelectorProps {
  reportMonth: Date
  setReportMonth: Dispatch<SetStateAction<Date>>
}

const MonthSelector = ({ reportMonth, setReportMonth }: MonthSelectorProps) => {
  const handlePrevClick = () => {
    const prevMonth = addMonths(reportMonth, -1)
    setReportMonth(prevMonth)
    localStorage.setItem('reportMonth', prevMonth.toISOString())
  }

  const handleNextClick = () => {
    const nextMonth = addMonths(reportMonth, +1)
    setReportMonth(nextMonth)
  }

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) setReportMonth(newDate)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MonthNavButton direction="PREV" onClick={handlePrevClick} />
        <DatePicker
          label="年月を選択"
          defaultValue={reportMonth} // 単なる初期値
          value={reportMonth} // 外部から変更可
          views={['year', 'month']} // 年 -> 月で選択
          openTo="month" // 月選択を最初に開く
          format="yyyy/MM"
          slotProps={{
            calendarHeader: { format: 'yyyy年 MM月' }, // 選択部分の直上部。デスクトップ版とモバイル版
            toolbar: { toolbarFormat: 'yyyy年 MM月' }, // 最上部。モバイル版のみ。
            // actionbar: {}, // モバイル版のみ。最下部のボタン種(OK, CANCELなど)をカスタムできる。
          }}
          onChange={handleDateChange}
          sx={{ mx: 2 }}
        />
        <MonthNavButton direction="NEXT" onClick={handleNextClick} />
      </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector
