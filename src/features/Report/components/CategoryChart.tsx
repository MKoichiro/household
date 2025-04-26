// MUI のチャートコンポーネントに切り替えても良いかも。
// ../../config/chartConfig.txをApp.tsxで読み込み済み
import { Box, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { ChartData, ChartOptions } from 'chart.js'
import { ChangeEvent, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  ExpenseCategory,
  expenseLiterals,
  ExpenseTransaction,
  IncomeCategory,
  incomeLiterals,
  IncomeTransaction,
  Transaction,
  TransactionType,
} from '../../../shared/types'
import { theme } from '../../../styles/theme/theme'
import { Context } from 'chartjs-plugin-datalabels'

// カテゴリーとカラーのマッピングを定義
interface ExpenseColorMap {
  backgroundColor: Record<ExpenseCategory, string>
  borderColor: Record<ExpenseCategory, string>
}

interface IncomeColorMap {
  backgroundColor: Record<IncomeCategory, string>
  borderColor: Record<IncomeCategory, string>
}

const expenseCategoryColorMap: ExpenseColorMap = {
  backgroundColor: {
    食費: theme.palette.expenseCategoryColor['食費'].main,
    日用品: theme.palette.expenseCategoryColor['日用品'].main,
    住居費: theme.palette.expenseCategoryColor['住居費'].main,
    交際費: theme.palette.expenseCategoryColor['交際費'].main,
    娯楽: theme.palette.expenseCategoryColor['娯楽'].main,
    交通費: theme.palette.expenseCategoryColor['交通費'].main,
  },
  borderColor: {
    食費: theme.palette.expenseCategoryColor['食費'].dark,
    日用品: theme.palette.expenseCategoryColor['日用品'].dark,
    住居費: theme.palette.expenseCategoryColor['住居費'].dark,
    交際費: theme.palette.expenseCategoryColor['交際費'].dark,
    娯楽: theme.palette.expenseCategoryColor['娯楽'].dark,
    交通費: theme.palette.expenseCategoryColor['交通費'].dark,
  },
}

const incomeCategoryColorMap: IncomeColorMap = {
  backgroundColor: {
    給与: theme.palette.incomeCategoryColor['給与'].main,
    副収入: theme.palette.incomeCategoryColor['副収入'].main,
    お小遣い: theme.palette.incomeCategoryColor['お小遣い'].main,
  },
  borderColor: {
    給与: theme.palette.incomeCategoryColor['給与'].dark,
    副収入: theme.palette.incomeCategoryColor['副収入'].dark,
    お小遣い: theme.palette.incomeCategoryColor['お小遣い'].dark,
  },
}

// コンポーネントここから
export interface CategoryChartProps {
  monthlyTransactions: Transaction[]
}

type ExpenseCategorySum = Partial<Record<ExpenseCategory, number>>
type IncomeCategorySum = Partial<Record<IncomeCategory, number>>

function CategoryChart({ monthlyTransactions: transactions }: CategoryChartProps) {
  // グラフ切り替えのためのステートとイベントハンドラー
  const [selectedType, setSelectedType] = useState<TransactionType>('expense')
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSelectedType(e.target.value as TransactionType)
  }

  // 支出データの準備
  // 支出タイプのtransactionsを取得
  const expenseTransactions: ExpenseTransaction[] = transactions.filter((t) => t.type === 'expense')

  // カテゴリ毎の合計を算出
  // e.g.) [ {"食費": 1950 }, {"日用品": 24000}, {"交際費": 0} ... ]
  const expenseCategorySums: ExpenseCategorySum[] = expenseLiterals.map((label) => {
    const sum = expenseTransactions.reduce((acc, t) => {
      return t.category === label ? (acc += t.amount) : acc
    }, 0)

    return { [label]: sum }
  })
  // console.log(expenseCategorySums)

  // 金額の降順にソート
  const expenseSortedSums = expenseCategorySums.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
  // console.log(expenseSortedSums)

  // ラベルのみの配列を用意
  // Object.key()の返り値は常にstring[]型になるためアサーションで明示
  // e.g.) ["食費", "交際費"]
  const expenseLabels = expenseSortedSums.map((item) => Object.keys(item)[0]) as ExpenseCategory[]

  // マッピングを参照して各部分の色を準備
  const expenseBackgroundColors = expenseLabels.map((label) => expenseCategoryColorMap.backgroundColor[label])
  const expenseBorderColors = expenseLabels.map((label) => expenseCategoryColorMap.borderColor[label])

  // Pieコンポーネントに渡すデータを定義
  const expenseData: ChartData<'pie'> = {
    labels: expenseLabels,
    datasets: [
      {
        label: '支出',
        data: expenseSortedSums.map((item) => Object.values(item)[0]),
        backgroundColor: expenseBackgroundColors,
        borderColor: expenseBorderColors,
        borderWidth: 0, // 現状非表示
        datalabels: {
          anchor: 'center',
        },
      },
    ],
  }

  // 収入データの準備ここから
  const incomeTransactions: IncomeTransaction[] = transactions.filter((t) => t.type === 'income')
  const incomeCategorySums: IncomeCategorySum[] = incomeLiterals.map((label) => {
    const sum = incomeTransactions.reduce((acc, t) => {
      return t.category === label ? acc + t.amount : acc
    }, 0)

    return { [label]: sum }
  })
  const incomeSortedSums = incomeCategorySums.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
  const incomeLabels = incomeSortedSums.map((item) => Object.keys(item)[0]) as IncomeCategory[]
  const incomeBackgroundColors = incomeLabels.map((label) => incomeCategoryColorMap.backgroundColor[label])
  const incomeBorderColors = incomeLabels.map((label) => incomeCategoryColorMap.borderColor[label])
  const incomeData: ChartData<'pie'> = {
    labels: incomeLabels,
    datasets: [
      {
        label: '収入',
        data: incomeSortedSums.map((item) => Object.values(item)[0]),
        backgroundColor: incomeBackgroundColors,
        borderColor: incomeBorderColors,
        borderWidth: 0, // 現状非表示
      },
    ],
  }
  // 収入データの準備ここまで

  // Pieコンポーネントに渡すオプション
  const options: ChartOptions<'pie'> = {
    devicePixelRatio: 2.5,
    maintainAspectRatio: false,
    responsive: false,
    plugins: {
      datalabels: {
        // backgroundColor: function(context: Context) {
        //   return context.dataset.backgroundColor;
        // },
        formatter: (_, context) => context.chart?.data.labels?.[context.dataIndex],
        font: {
          weight: 'bold',
        },
        color: 'white',
        // padding: 6,
        // backgroundColor: "black",
        // borderColor: 'white',
        // borderRadius: 25,
        // borderWidth: 2,
        display: function (context: Context) {
          const dataset = context.dataset
          const count = dataset.data.length
          const value = dataset.data[context.dataIndex] as number
          return value > count * 1.5
        },
        // formatter: Math.round
      },
    },
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <FormControl sx={{ alignItems: 'center' }}>
        <FormLabel id="type-label">支出 / 収入</FormLabel>
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
                  '&.Mui-checked': {
                    color: theme.palette.expenseColor.main,
                  },
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
                  '&.Mui-checked': {
                    color: theme.palette.incomeColor.main,
                  },
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
        style={{ margin: '0 auto' }}
        height="300px"
      />
    </Box>
  )
}

export default CategoryChart
