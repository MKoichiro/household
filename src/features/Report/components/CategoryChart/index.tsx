// MUI のチャートコンポーネントに切り替えても良いかも。
// NOTE: ../../config/chartConfig.tx を App.tsx で読み込み済み
import styled from '@emotion/styled'
import { Divider, Stack, Typography, useTheme } from '@mui/material'
import type { ChartData, ChartOptions } from 'chart.js'
import type { MouseEvent } from 'react'
import { useState } from 'react'
import { Pie } from 'react-chartjs-2'

import NoData from '@features/Report/components/NoData'
import type { Transaction, TransactionType } from '@shared/types'
import { cp } from '@styles/theme/helpers/colorPickers'
import TransactionTypeToggleButton from '@ui/TransactionTypeToggleButton'

import createPieOptions from './createPieOptions'
import useCategoryChartData from './useCategoryChartData'

export interface CategoryChartProps {
  monthlyTransactions: Transaction[]
}

function CategoryChart({ monthlyTransactions: transactions }: CategoryChartProps) {
  const theme = useTheme()
  const [selectedType, setSelectedType] = useState<TransactionType>('expense')
  const handleChange = (_e: MouseEvent<HTMLElement>, newValue: TransactionType) => {
    setSelectedType(newValue)
  }

  const { expenseData, incomeData } = useCategoryChartData(transactions, theme)
  const options: ChartOptions<'pie'> = createPieOptions(theme)

  return (
    <Stack gap={2}>
      <StyledTypography variant="subtitle1">カテゴリ内訳</StyledTypography>
      <Stack gap={1}>
        <TransactionTypeToggleButton currentType={selectedType} handleChange={handleChange} />
        <Divider />
        <PieWithNoDataGuard data={selectedType === 'expense' ? expenseData : incomeData} options={options} />
      </Stack>
    </Stack>
  )
}

const PieWithNoDataGuard = ({ data, options }: { data: ChartData<'pie'> | null; options: ChartOptions<'pie'> }) => {
  if (!data || data.datasets[0].data.length === 0) return <NoData height="280px" />
  return <Pie data={data} options={options} height="280px" width="250px" style={{ margin: 'auto' }} />
}

const StyledTypography = styled(Typography)`
  font-weight: bold;
  font-size: 1.6rem;
  text-align: center;
  color: ${({ theme }) => cp(theme, 'app.lighterBg.level1.contrastText')};
`

export default CategoryChart
