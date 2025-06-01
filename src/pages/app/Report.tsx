import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import ReportPresenter from '@features/Report/Presenter'
import { useTransaction } from '@shared/hooks/useContexts'
import type { Transaction } from '@shared/types'
import { formatMonth } from '@shared/utils/formatting'

export interface ReportStates {
  monthlyTransactions: Transaction[]
  selectedMonth: Date
  isLoading: boolean
  // result: string
  // error: string | null
  // loading: boolean
}

export interface ReportActions {
  setSelectedMonth: Dispatch<SetStateAction<Date>>
  // setResult: Dispatch<SetStateAction<string>>
  // setError: Dispatch<SetStateAction<string | null>>
  // setLoading: Dispatch<SetStateAction<boolean>>
}

const ReportContainer = () => {
  const { transactions, isLoading } = useTransaction()
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(formatMonth(selectedMonth)))

  // // AI レポートの結果とエラー、ローディング状態を管理
  // const [result, setResult] = useState<string>('')
  // const [error, setError] = useState<string | null>(null)
  // const [loading, setLoading] = useState<boolean>(false)

  const states: ReportStates = {
    monthlyTransactions,
    selectedMonth,
    isLoading,
    // result,
    // error,
    // loading,
  }

  const actions: ReportActions = {
    setSelectedMonth,
    // setResult,
    // setError,
    // setLoading,
  }

  return <ReportPresenter states={states} actions={actions} />
}

export default ReportContainer
