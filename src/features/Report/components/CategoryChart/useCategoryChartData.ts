import type { PaletteMode, Theme } from '@mui/material'
import type { ChartData } from 'chart.js'

import type { ExpenseCategory, IncomeCategory, Transaction, TransactionType } from '@shared/types'
import { expenseLiterals, incomeLiterals } from '@shared/types'
import { calculateCategorySummaries } from '@shared/utils/financeCalculations'
import { cp } from '@styles/theme/helpers/colorPickers'

// カテゴリーとカラーのマッピングを定義
interface ExpenseColorMap {
  backgroundColor: Record<ExpenseCategory, string>
  borderColor: Record<ExpenseCategory, string>
}

interface IncomeColorMap {
  backgroundColor: Record<IncomeCategory, string>
  borderColor: Record<IncomeCategory, string>
}

const oppositeShade = (mode: PaletteMode): PaletteMode => {
  return mode === 'light' ? 'dark' : 'light'
}

const createColorMap = <T extends ExpenseCategory | IncomeCategory>(
  theme: Theme,
  property: 'backgroundColor' | 'borderColor',
  category: TransactionType
): Record<T, string> => {
  return (category === 'expense' ? expenseLiterals : incomeLiterals).reduce(
    (acc, label) => {
      acc[label as T] = cp(
        theme,
        `${category}Category.${label}`,
        property === 'borderColor' ? oppositeShade(theme.palette.mode) : undefined
      )
      return acc
    },
    {} as Record<T, string>
  )
}

const expenseCategoryColorMap = (theme: Theme): ExpenseColorMap => ({
  backgroundColor: createColorMap<ExpenseCategory>(theme, 'backgroundColor', 'expense'),
  borderColor: createColorMap<ExpenseCategory>(theme, 'borderColor', 'expense'),
})

const incomeCategoryColorMap = (theme: Theme): IncomeColorMap => ({
  backgroundColor: createColorMap<IncomeCategory>(theme, 'backgroundColor', 'income'),
  borderColor: createColorMap<IncomeCategory>(theme, 'borderColor', 'income'),
})

const useCategoryChartData = (transactions: Transaction[], theme: Theme) => {
  // 収入タイプ毎、カテゴリ毎の、合計金額降順の配列を用意
  // e.g.) incomeSortedSums: [ {"給与": 500000 }, {"副収入": 10000}, ... ]
  const { expense: expenseSortedSums, income: incomeSortedSums } = calculateCategorySummaries(transactions)

  // 0 円のカテゴリを除外するためのフィルタリング
  const expenseFilteredSums = expenseSortedSums.filter((item) => Object.values(item)[0] > 0)
  const incomeFilteredSums = incomeSortedSums.filter((item) => Object.values(item)[0] > 0)

  // --- 支出データの準備ここから ---
  // ソートされたラベルのみの配列を用意: e.g.) ["食費", "交際費"]
  const expenseLabels = expenseFilteredSums.map((item) => Object.keys(item)[0]) as ExpenseCategory[]

  // マッピングを参照して各部分の色を準備
  const expenseBackgroundColors = expenseLabels.map((label) => expenseCategoryColorMap(theme).backgroundColor[label])
  const expenseBorderColors = expenseLabels.map((label) => expenseCategoryColorMap(theme).borderColor[label])

  // Pieコンポーネントに渡すデータを定義
  const expenseData: ChartData<'pie'> = {
    labels: expenseLabels,
    datasets: [
      {
        label: '支出',
        data: expenseFilteredSums.map((item) => Object.values(item)[0]),
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
  const incomeLabels = incomeFilteredSums.map((item) => Object.keys(item)[0]) as IncomeCategory[]
  const incomeBackgroundColors = incomeLabels.map((label) => incomeCategoryColorMap(theme).backgroundColor[label])
  const incomeBorderColors = incomeLabels.map((label) => incomeCategoryColorMap(theme).borderColor[label])
  const incomeData: ChartData<'pie'> = {
    labels: incomeLabels,
    datasets: [
      {
        label: '収入',
        data: incomeFilteredSums.map((item) => Object.values(item)[0]),
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
