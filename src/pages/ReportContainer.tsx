import { Dispatch, SetStateAction, useState } from 'react'
import { formatMonth } from '../shared/utils/formatting'
import { useTransaction } from '../shared/hooks/useContexts'
import { Transaction } from '../shared/types'
import ReportPresenter from '../features/Report/ReportPresenter'

export interface ReportStates {
  monthlyTransactions: Transaction[]
  selectedMonth: Date
  isLoading: boolean
}

export interface ReportActions {
  setSelectedMonth: Dispatch<SetStateAction<Date>>
}

const ReportContainer = () => {
  const { transactions, isLoading } = useTransaction()
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(formatMonth(selectedMonth)))

  const states: ReportStates = {
    monthlyTransactions,
    selectedMonth,
    isLoading,
  }

  const actions: ReportActions = {
    setSelectedMonth,
  }

  return <ReportPresenter states={states} actions={actions} />
}

export default ReportContainer
