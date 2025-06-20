import styled from '@emotion/styled'
import type { SxProps, Theme } from '@mui/material'
import { Grid, Paper } from '@mui/material'

import type { ReportActions, ReportStates } from '@pages/app/Report'
import { pagePaddingTemplate } from '@styles/constants'
import { cpf } from '@styles/theme/helpers/colorPickers'

import type { MonthSelectorProps, CategoryChartProps, BarChartProps, TransactionTableProps } from './components'
import { NoData, MonthSelector, CategoryChart, BarChart, TransactionTable } from './components'
import AIAdvisor from './components/AIAdvisor/AIAdvisor'

const paperCommonStyle: SxProps<Theme> = {
  minHeight: '400px',
  bgcolor: cpf('app.lighterBg.level2.bg'),
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
  const { monthlyTransactions, reportMonth, isLoading } = states
  const { setReportMonth } = actions

  const monthSelectorProps: MonthSelectorProps = {
    reportMonth,
    setReportMonth,
  }

  const aiAdvisorProps = {
    monthlyTransactions,
    reportMonth,
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
        <Grid component="section" size={{ xs: 12 }}>
          <MonthSelector {...monthSelectorProps} />
        </Grid>

        {/* 月選択部分 */}
        <Grid component="section" size={{ xs: 12 }}>
          <AIAdvisor {...aiAdvisorProps} />
        </Grid>

        {/* 円グラフ */}
        <Grid component="section" size={{ xs: 12, md: 6, lg: 4 }}>
          <Paper sx={{ ...paperCommonStyle, ...chartCommonStyle }}>
            {monthlyTransactions.length > 0 ? <CategoryChart {...categoryChartProps} /> : <NoData />}
          </Paper>
        </Grid>

        {/* 棒グラフ */}
        <Grid component="section" size={{ xs: 12, md: 6, lg: 8 }}>
          <Paper sx={{ ...paperCommonStyle, ...chartCommonStyle }}>
            {monthlyTransactions.length > 0 ? <BarChart {...barChartProps} /> : <NoData />}
          </Paper>
        </Grid>

        {/* 表 */}
        <Grid component="section" size={{ xs: 12 }}>
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
