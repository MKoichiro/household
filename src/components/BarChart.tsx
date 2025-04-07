// ../../config/chartConfig.txをApp.tsxで読み込み済み
import {
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2'
import { Transaction } from '../types';
import { calculateDailyBalances } from '../utils/financeCalculations';
import { theme } from '../theme/theme';
import { Box, CircularProgress } from '@mui/material';

const options: ChartOptions<"bar"> = {
  devicePixelRatio: 2.5,
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '日別収支',
    },
    datalabels: {
      display: false
    }
  },
}

interface BarChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const BarChart = ({ monthlyTransactions: transactions, isLoading }: BarChartProps) => {

  const dailySummaries = calculateDailyBalances(transactions)

  const dateLabels = Object.keys(dailySummaries).sort()
  const incomeData  = dateLabels.map(day => dailySummaries[day].income)
  const expenseData = dateLabels.map(day => dailySummaries[day].expense)
  const balanceData = dateLabels.map(day => dailySummaries[day].balance)

  const data: ChartData<"bar"> = {
    labels: dateLabels,
    datasets: [
      {
        label: '収入',
        data: incomeData,
        backgroundColor: theme.palette.incomeColor.light,
        borderColor: theme.palette.incomeColor.dark,
        borderWidth: { top: 1.6, right: 1.6, bottom: 1.6, left: 1.6 },
      },
      {
        label: '支出',
        data: expenseData,
        backgroundColor: theme.palette.expenseColor.light,
        borderColor: theme.palette.expenseColor.dark,
        borderWidth: { top: 1.6, right: 1.6, bottom: 1.6, left: 1.6 },
      },
      {
        label: '収支',
        data: balanceData,
        backgroundColor: theme.palette.balanceColor.light,
        borderColor: theme.palette.balanceColor.dark,
        borderWidth: { top: 1.6, right: 1.6, bottom: 1.6, left: 1.6 },
      },
    ],
  }


  return (
    <Box flexGrow={1} display='flex' justifyContent="center" alignItems="center">
      {isLoading ? (
          <CircularProgress />
      ) : (
        <Bar options={options} data={data} />
      )}
    </Box>
  )
}

export default BarChart
