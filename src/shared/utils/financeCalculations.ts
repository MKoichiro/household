import type { Balance, DailyBalances, Transaction } from '@shared/types'

export function financeCalculations(transactions: Transaction[]): Balance {
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
export function calculateDailyBalances(transactions: Transaction[]): DailyBalances {
  return transactions.reduce<DailyBalances>((acc, transaction) => {
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
