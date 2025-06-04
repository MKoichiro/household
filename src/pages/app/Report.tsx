import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useMemo, useState } from 'react'

import ReportPresenter from '@features/Report/Presenter'
import { useTransaction } from '@shared/hooks/useContexts'
import type { Transaction } from '@shared/types'
import { formatMonth } from '@shared/utils/formatting'

export interface ReportStates {
  monthlyTransactions: Transaction[]
  reportMonth: Date
  isLoading: boolean
}

export interface ReportActions {
  setReportMonth: Dispatch<SetStateAction<Date>>
}

const ReportContainer = () => {
  const { transactions, isLoading } = useTransaction()
  const [reportMonth, setReportMonth] = useState(new Date())
  const monthlyTransactions = useMemo(
    () => transactions.filter((t) => t.date.startsWith(formatMonth(reportMonth))),
    [transactions, reportMonth]
  )

  useEffect(() => {
    const savedMonth = localStorage.getItem('reportMonth')
    if (savedMonth) setReportMonth(new Date(savedMonth))
  }, [])

  const states: ReportStates = {
    monthlyTransactions,
    reportMonth,
    isLoading,
  }

  const actions: ReportActions = {
    setReportMonth,
  }

  return <ReportPresenter states={states} actions={actions} />
}

export default ReportContainer
