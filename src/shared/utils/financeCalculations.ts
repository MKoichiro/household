import type {
  ExpenseCategory,
  IncomeCategory,
  ExpenseTransaction,
  IncomeTransaction,
  ExpenseCategorySum,
  IncomeCategorySum,
} from '@shared/types'
import type { Transaction, Summary, DailySummaries } from '@shared/types'
import { expenseLiterals, incomeLiterals } from '@shared/types'

export function financeCalculations(transactions: Transaction[]): Summary {
  return transactions.reduce(
    (acc, transaction) => {
      switch (transaction.type) {
        case 'income':
          acc.income += transaction.amount
          break
        case 'expense':
          acc.expense += transaction.amount
          break
      }

      acc.balance = acc.income - acc.expense //最後だけやれば良いので修正可（？）

      return acc
    },
    { income: 0, expense: 0, balance: 0 }
  )
}

// 一日あたりの収支を計算
// { "2025-03-01": { income: 100, expense: 100, balance: 0 }, ... }
export function calculateDailySummaries(transactions: Transaction[]): DailySummaries {
  return transactions.reduce<DailySummaries>((acc, transaction) => {
    const day = transaction.date
    if (!acc[day]) {
      acc[day] = { income: 0, expense: 0, balance: 0 }
    }
    switch (transaction.type) {
      case 'income':
        acc[day].income += transaction.amount
        break
      case 'expense':
        acc[day].expense += transaction.amount
        break
    }
    acc[day].balance = acc[day].income - acc[day].expense

    return acc
  }, {})
}

export const calculateCategorySummaries = (transactions: Transaction[]) => {
  // --- expense ---
  // 支出タイプの transactions を取得
  const expenseTransactions: ExpenseTransaction[] = transactions.filter((t) => t.type === 'expense')
  // カテゴリ毎の合計を算出: e.g.) [ {"食費": 1950 }, {"日用品": 24000}, {"交際費": 0} ... ]
  const expenseCategorySums = calculateCategorySums<ExpenseCategorySum[]>(expenseLiterals, expenseTransactions)
  // 金額の降順にソート
  const expenseSortedSums = sortByAmountDesc(expenseCategorySums)

  // --- income ---
  const incomeTransactions: IncomeTransaction[] = transactions.filter((t) => t.type === 'income')
  const incomeCategorySums = calculateCategorySums<IncomeCategorySum[]>(incomeLiterals, incomeTransactions)
  const incomeSortedSums = sortByAmountDesc(incomeCategorySums)

  return { expense: expenseSortedSums, income: incomeSortedSums }
}

// ヘルパー
// TODO: O(N * M) から O(N) に改善する
// function calculateCategorySums<R extends ExpenseCategorySum[] | IncomeCategorySum[]>(
//   literals: (ExpenseCategory | IncomeCategory)[],
//   transactions: ExpenseTransaction[] | IncomeTransaction[]
// ): R {
//   return literals.map((label) => {
//     const sum = transactions.reduce((acc, t) => (t.category === label ? acc + t.amount : acc), 0)
//     return { [label]: sum }
//   }) as R
// }
function calculateCategorySums<R extends ExpenseCategorySum[] | IncomeCategorySum[]>(
  literals: (ExpenseCategory | IncomeCategory)[],
  transactions: ExpenseTransaction[] | IncomeTransaction[]
): R {
  // 1. カテゴリごとの合計を保持するオブジェクトを初期化
  const sumMap: Record<string, number> = {}
  for (const label of literals) {
    sumMap[label] = 0
  }

  // 2. トランザクションを一度だけループして集計
  for (const t of transactions) {
    // sumMap[t.category] は必ず初期化済み
    sumMap[t.category] += t.amount
  }

  // 3. リテラル配列の順序に従って結果の配列を作成
  const result = literals.map((label) => {
    return { [label]: sumMap[label] }
  })

  return result as R
}

function sortByAmountDesc<T extends ExpenseCategorySum[] | IncomeCategorySum[]>(categorySums: T) {
  return categorySums.sort((a, b) => Object.values(b)[0] - Object.values(a)[0]) as T
}
