import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import ReportPresenter from '@features/Report/Presenter'
import { useTransaction } from '@shared/hooks/useContexts'
import type { Transaction } from '@shared/types'
import { formatMonth } from '@shared/utils/formatting'

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

  useEffect(() => {
    const savedMonth = localStorage.getItem('selectedMonth')
    if (savedMonth) {
      setSelectedMonth(new Date(savedMonth))
    }
  }, [])

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
