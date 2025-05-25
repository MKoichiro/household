// NOTE: ../../config/chartConfig.tx を App.tsx で読み込み済み
import { ChartData, ChartOptions } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Transaction } from '../../../../shared/types'
import { calculateDailyBalances } from '../../../../shared/utils/financeCalculations'
import { Box, CircularProgress, useTheme } from '@mui/material'
import { format } from 'date-fns'
import createBarOptions from './createBarOptions'
import { useRemToPx } from '../../../../shared/hooks/useRemToPx'

export interface BarChartProps {
  monthlyTransactions: Transaction[]
  isLoading: boolean
}

const BarChart = ({ monthlyTransactions: transactions, isLoading }: BarChartProps) => {
  const dailySummaries = calculateDailyBalances(transactions)

  const dates = Object.keys(dailySummaries).sort()
  const incomeData = dates.map((day) => dailySummaries[day].income)
  const expenseData = dates.map((day) => dailySummaries[day].expense)
  const balanceData = dates.map((day) => dailySummaries[day].balance)
  const dateLabels = dates.map((date) => format(new Date(date), 'd'))

  const theme = useTheme()
  const { remToPx } = useRemToPx()

  const data: ChartData<'bar'> = {
    labels: dateLabels,
    datasets: [
      {
        label: '収入',
        data: incomeData,
        backgroundColor: theme.palette.income.font.lighter[theme.palette.mode],
        borderColor: theme.palette.income.font.darker[theme.palette.mode],
        borderWidth: { top: 1.6, right: 1.6, bottom: 1.6, left: 1.6 },
      },
      {
        label: '支出',
        data: expenseData,
        backgroundColor: theme.palette.expense.font.lighter[theme.palette.mode],
        borderColor: theme.palette.expense.font.darker[theme.palette.mode],
        borderWidth: { top: 1.6, right: 1.6, bottom: 1.6, left: 1.6 },
      },
      {
        label: '収支',
        data: balanceData,
        backgroundColor: theme.palette.balance.font.lighter[theme.palette.mode],
        borderColor: theme.palette.balance.font.darker[theme.palette.mode],
        borderWidth: { top: 1.6, right: 1.6, bottom: 1.6, left: 1.6 },
      },
    ],
  }

  const options: ChartOptions<'bar'> = createBarOptions(theme, remToPx)

  return (
    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center" sx={{ overflowX: 'auto' }}>
      {isLoading ? <CircularProgress /> : <Bar options={options} data={data} />}
    </Box>
  )
}

export default BarChart
