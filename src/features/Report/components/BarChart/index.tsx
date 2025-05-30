// NOTE: ../../config/chartConfig.tx を App.tsx で読み込み済み
import { Box, CircularProgress, useTheme } from '@mui/material'
import type { ChartData, ChartOptions } from 'chart.js'
import { format } from 'date-fns'
import { Bar } from 'react-chartjs-2'

import { useRemToPx } from '@shared/hooks/useRemToPx'
import type { Transaction } from '@shared/types'
import { calculateDailySummaries } from '@shared/utils/financeCalculations'
import { cp } from '@styles/theme/helpers/colorPickers'

import createBarOptions from './createBarOptions'

export interface BarChartProps {
  monthlyTransactions: Transaction[]
  isLoading: boolean
}

const BarChart = ({ monthlyTransactions: transactions, isLoading }: BarChartProps) => {
  const dailySummaries = calculateDailySummaries(transactions)

  const dates = Object.keys(dailySummaries).sort()
  const incomeData = dates.map((day) => dailySummaries[day].income)
  const expenseData = dates.map((day) => dailySummaries[day].expense)
  const balanceData = dates.map((day) => dailySummaries[day].balance)
  const dateLabels = dates.map((date) => format(new Date(date), 'd'))

  const theme = useTheme()
  const { remToPx } = useRemToPx()

  const commonConfigs = {
    borderWeight: remToPx(0.16),
  }

  const data: ChartData<'bar'> = {
    labels: dateLabels,
    datasets: [
      {
        label: '収入',
        data: incomeData,
        backgroundColor: cp(theme, 'income.bg.lighter'),
        borderColor: cp(theme, 'income.bg.darker'),
        borderWidth: commonConfigs.borderWeight,
      },
      {
        label: '支出',
        data: expenseData,
        backgroundColor: cp(theme, 'expense.bg.lighter'),
        borderColor: cp(theme, 'expense.bg.darker'),
        borderWidth: commonConfigs.borderWeight,
      },
      {
        label: '収支',
        data: balanceData,
        backgroundColor: cp(theme, 'balance.bg.lighter'),
        borderColor: cp(theme, 'balance.bg.darker'),
        borderWidth: commonConfigs.borderWeight,
      },
    ],
  }

  const options: ChartOptions<'bar'> = createBarOptions(theme, remToPx)

  return (
    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" sx={{ overflowX: 'auto' }}>
      {isLoading ? <CircularProgress /> : <Bar options={options} data={data} redraw />}
    </Box>
  )
}

export default BarChart
