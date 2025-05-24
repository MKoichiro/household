// MUI のチャートコンポーネントに切り替えても良いかも。
// NOTE: ../../config/chartConfig.tx を App.tsx で読み込み済み
import { Box, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, useTheme } from '@mui/material'
import { ChartOptions } from 'chart.js'
import { Pie } from 'react-chartjs-2'
import { Transaction, TransactionType } from '../../../../shared/types'
import useCategoryChartData from './useCategoryChartData'
import createPieOptions from './createPieOptions'
import { ChangeEvent, useState } from 'react'

// コンポーネントここから
export interface CategoryChartProps {
  monthlyTransactions: Transaction[]
}

function CategoryChart({ monthlyTransactions: transactions }: CategoryChartProps) {
  const theme = useTheme()
  const [selectedType, setSelectedType] = useState<TransactionType>('expense')
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedType(e.target.value as TransactionType)
  }

  const { expenseData, incomeData } = useCategoryChartData(transactions, theme)
  const options: ChartOptions<'pie'> = createPieOptions(theme)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <FormControl sx={{ alignItems: 'center' }}>
        <FormLabel
          id="type-label"
          sx={{
            color: (theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode],
            fontWeight: 'fontWeightBold',
            fontSize: '1.6rem',
          }}
        >
          カテゴリ内訳
        </FormLabel>
        <RadioGroup
          aria-labelledby="type-label"
          defaultValue="expense"
          value={selectedType}
          name="type-radio-group"
          onChange={handleChange}
          row
        >
          <FormControlLabel
            value="expense"
            control={
              <Radio
                sx={{
                  color: theme.palette.expenseColor.main,
                  '&.Mui-checked': { color: theme.palette.expenseColor.main },
                }}
              />
            }
            label="支出"
          />
          <FormControlLabel
            value="income"
            control={
              <Radio
                sx={{
                  color: theme.palette.incomeColor.main,
                  '&.Mui-checked': { color: theme.palette.incomeColor.main },
                }}
              />
            }
            label="収入"
          />
        </RadioGroup>
      </FormControl>
      <Divider sx={{ mt: 1, mb: 0.5 }} />
      <Pie
        data={selectedType === 'expense' ? expenseData : incomeData}
        options={options}
        style={{ margin: 'auto' }}
        height="300px"
        width="250px"
      />
    </Box>
  )
}

export default CategoryChart
