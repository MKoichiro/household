export type TransactionType = 'income' | 'expense'
export type TransactionKeyType = TransactionType | 'balance'
export type TransactionDisplayType = '収入' | '支出' | '残高'

// 読み取り専用の定義
const expenseLiteralsConst = ['食費', '日用品', '住居費', '交際費', '娯楽', '交通費'] as const
const incomeLiteralsConst = ['給与', '副収入', 'お小遣い'] as const

export type ExpenseCategory = (typeof expenseLiteralsConst)[number]
export type IncomeCategory = (typeof incomeLiteralsConst)[number]

export const expenseLiterals: ExpenseCategory[] = [...expenseLiteralsConst]
export const incomeLiterals: IncomeCategory[] = [...incomeLiteralsConst]

interface BaseTransaction<T extends TransactionType, U extends IncomeCategory | ExpenseCategory> {
  id: string
  amount: number
  type: T
  date: string
  category: U
  content: string
  uid: string
}

export type IncomeTransaction = BaseTransaction<'income', IncomeCategory>
export type ExpenseTransaction = BaseTransaction<'expense', ExpenseCategory>
export type Transaction = IncomeTransaction | ExpenseTransaction

export interface Summary {
  income: number
  expense: number
  balance: number
}

export interface SummaryFormatted {
  income: string // e.g.) "1,000"
  expense: string
  balance: string
}

export type DailySummaries = Record<string, Summary>

export type ExpenseCategorySum = Partial<Record<ExpenseCategory, number>>
export type IncomeCategorySum = Partial<Record<IncomeCategory, number>>

export type CalendarContent = {
  start: string
} & SummaryFormatted

// useFormのジェネリクス、初期値を含めた緩い型
// zodのvalidationで初期値の禁止（""など）ははじく
export interface TransactionFormValues {
  amount: string
  type: TransactionType
  date: string
  category: IncomeCategory | ExpenseCategory | ''
  content: string
}
