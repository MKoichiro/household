import {
  ExpenseCategory,
  expenseLiterals,
  ExpenseTransaction,
  IncomeCategory,
  incomeLiterals,
  IncomeTransaction,
  Transaction,
} from '../../../../shared/types'
import { Theme } from '@mui/material'
import { ChartData } from 'chart.js'

// カテゴリーとカラーのマッピングを定義
interface ExpenseColorMap {
  backgroundColor: Record<ExpenseCategory, string>
  borderColor: Record<ExpenseCategory, string>
}

interface IncomeColorMap {
  backgroundColor: Record<IncomeCategory, string>
  borderColor: Record<IncomeCategory, string>
}

const expenseCategoryColorMap = (theme: Theme): ExpenseColorMap => ({
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
})

const incomeCategoryColorMap = (theme: Theme): IncomeColorMap => ({
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
})

type ExpenseCategorySum = Partial<Record<ExpenseCategory, number>>
type IncomeCategorySum = Partial<Record<IncomeCategory, number>>

const useCategoryChartData = (transactions: Transaction[], theme: Theme) => {
  // --- 支出データの準備ここから ---
  // 支出タイプのtransactionsを取得
  const expenseTransactions: ExpenseTransaction[] = transactions.filter((t) => t.type === 'expense')

  // カテゴリ毎の合計を算出
  // e.g.) [ {"食費": 1950 }, {"日用品": 24000}, {"交際費": 0} ... ]
  const expenseCategorySums: ExpenseCategorySum[] = expenseLiterals.map((label) => {
    const sum = expenseTransactions.reduce((acc, t) => (t.category === label ? (acc += t.amount) : acc), 0)
    return { [label]: sum }
  })

  // 金額の降順にソート
  const expenseSortedSums = expenseCategorySums.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])

  // ラベルのみの配列を用意
  // Object.*()の返り値は常にstring[]型になるためアサーションで明示
  // e.g.) ["食費", "交際費"]
  const expenseLabels = expenseSortedSums.map((item) => Object.keys(item)[0]) as ExpenseCategory[]

  // マッピングを参照して各部分の色を準備
  const expenseBackgroundColors = expenseLabels.map((label) => expenseCategoryColorMap(theme).backgroundColor[label])
  const expenseBorderColors = expenseLabels.map((label) => expenseCategoryColorMap(theme).borderColor[label])

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
  // --- 支出データの準備ここまで ---

  // --- 収入データの準備ここから ---
  const incomeTransactions: IncomeTransaction[] = transactions.filter((t) => t.type === 'income')
  const incomeCategorySums: IncomeCategorySum[] = incomeLiterals.map((label) => {
    const sum = incomeTransactions.reduce((acc, t) => (t.category === label ? acc + t.amount : acc), 0)
    return { [label]: sum }
  })
  const incomeSortedSums = incomeCategorySums.sort((a, b) => Object.values(b)[0] - Object.values(a)[0])
  const incomeLabels = incomeSortedSums.map((item) => Object.keys(item)[0]) as IncomeCategory[]
  const incomeBackgroundColors = incomeLabels.map((label) => incomeCategoryColorMap(theme).backgroundColor[label])
  const incomeBorderColors = incomeLabels.map((label) => incomeCategoryColorMap(theme).borderColor[label])
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
  // --- 収入データの準備ここまで ---

  return { expenseData, incomeData }
}

export default useCategoryChartData
