import { Grid, Paper } from '@mui/material'
import {
  NoData,
  MonthSelector,
  MonthSelectorProps,
  CategoryChart,
  CategoryChartProps,
  BarChart,
  BarChartProps,
  TransactionTable,
  TransactionTableProps,
} from './components'
import styled from '@emotion/styled'
import { ReportActions, ReportStates } from '../../pages/ReportContainer'

const ReportRoot = styled.div`
  padding: 1rem;
`

const commonPaperStyle = {
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  px: 2,
  py: 1,
}

interface ReportPresenterProps {
  states: ReportStates
  actions: ReportActions
}

const ReportPresenter = ({ states, actions }: ReportPresenterProps) => {
  const { monthlyTransactions, selectedMonth, isLoading } = states
  const { setSelectedMonth } = actions

  const monthSelectorProps: MonthSelectorProps = {
    selectedMonth,
    setSelectedMonth,
  }

  const categoryChartProps: CategoryChartProps = {
    monthlyTransactions,
  }

  const barChartProps: BarChartProps = {
    monthlyTransactions,
    isLoading,
  }

  const transactionTableProps: TransactionTableProps = {
    monthlyTransactions,
  }

  return (
    <ReportRoot>
      <Grid container spacing={2}>
        {/* 月選択部分 */}
        <Grid size={{ xs: 12 }}>
          <MonthSelector {...monthSelectorProps} />
        </Grid>

        {/* 円グラフ */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={commonPaperStyle}>
            {monthlyTransactions.length > 0 ? <CategoryChart {...categoryChartProps} /> : <NoData />}
          </Paper>
        </Grid>

        {/* 棒グラフ */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={commonPaperStyle}>
            {monthlyTransactions.length > 0 ? <BarChart {...barChartProps} /> : <NoData />}
          </Paper>
        </Grid>

        {/* 表 */}
        <Grid size={{ xs: 12 }}>
          <TransactionTable {...transactionTableProps} />
        </Grid>
      </Grid>
    </ReportRoot>
  )
}

export default ReportPresenter
