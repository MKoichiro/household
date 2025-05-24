import { Grid, Paper, SxProps, Theme } from '@mui/material'
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
import { pagePaddingTemplate } from '../../styles/constants'

const paperCommonStyle: SxProps<Theme> = {
  minHeight: '400px',
  bgcolor: (theme) => theme.palette.app.lighterBg.level2.bg[theme.palette.mode],
  px: 2,
  py: 1,
}

const chartCommonStyle: SxProps<Theme> = {
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
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
          <Paper sx={{ ...paperCommonStyle, ...chartCommonStyle }}>
            {monthlyTransactions.length > 0 ? <CategoryChart {...categoryChartProps} /> : <NoData />}
          </Paper>
        </Grid>

        {/* 棒グラフ */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ ...paperCommonStyle, ...chartCommonStyle }}>
            {monthlyTransactions.length > 0 ? <BarChart {...barChartProps} /> : <NoData />}
          </Paper>
        </Grid>

        {/* 表 */}
        <Grid size={{ xs: 12 }}>
          <Paper sx={{ ...paperCommonStyle }}>
            {monthlyTransactions.length > 0 ? <TransactionTable {...transactionTableProps} /> : <NoData />}
          </Paper>
        </Grid>
      </Grid>
    </ReportRoot>
  )
}

const ReportRoot = styled.div`
  ${({ theme }) => pagePaddingTemplate(theme)}
`

export default ReportPresenter
