import { Balance, DailyBalances, Transaction } from '../types'

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

// const transactions: Transaction[] = [
//   {
//     amount: 1800,
//     category: "娯楽",
//     content: "映画鑑賞",
//     date: "2025-02-18",
//     id: "2zNvfUBnQfvZDu9FLmFK",
//     type: "expense",
//   },
//   {
//     amount: 5000,
//     category: "お小遣い",
//     content: "映画鑑賞",
//     date: "2025-02-18",
//     id: "2zNvfUBnQfvZDu9FLmFK",
//     type: "income",
//   },
//   {
//     amount: 225000,
//     category: "給与",
//     content: "映画鑑賞",
//     date: "2025-02-01",
//     id: "2zNvfUBnQfvZDu9FLmFK",
//     type: "income",
//   },
//   {
//     amount: 50000,
//     category: "交際費",
//     content: "映画鑑賞",
//     date: "2025-02-01",
//     id: "2zNvfUBnQfvZDu9FLmFK",
//     type: "expense",
//   },
// ]
// console.log(calculateDailyBalances(transactions));
