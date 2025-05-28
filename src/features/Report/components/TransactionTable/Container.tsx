import { compareAsc, parseISO } from 'date-fns'
import type { MouseEvent, ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

import { useTransaction } from '@shared/hooks/useContexts'
import type { Transaction } from '@shared/types'
import { financeCalculations } from '@shared/utils/financeCalculations'
import { formatCurrency } from '@shared/utils/formatting'

import TransactionTablePresenter from './Presenter'

export interface TransactionTableProps {
  monthlyTransactions: Transaction[]
}

const TransactionTable = ({ monthlyTransactions: transactions }: TransactionTableProps) => {
  const { income, expense, balance } = financeCalculations(transactions)
  const summaryFormatted = {
    income: formatCurrency(income),
    expense: formatCurrency(expense),
    balance: formatCurrency(balance),
  }

  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { handleDeleteTransaction } = useTransaction()

  // 最終ページのパディング用の空行数を計算
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0

  // 表示する1ページの Transaction[]
  const visibleRows = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, transactions]
  )

  // ハンドラー
  const handleDeleteClick = () => {
    void handleDeleteTransaction(selected)
    setSelected([])
  }

  const handleSelectAllClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = transactions.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleRowClick = (id: string) => () => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (_e: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const states = {
    summaryFormatted,
    selected,
    transactions,
    visibleRows,
    emptyRows,
    rowsPerPage,
    page,
  }

  const actions = {
    onDeleteClick: handleDeleteClick,
    onSelectAllClick: handleSelectAllClick,
    onRowClick: handleRowClick,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  }

  return <TransactionTablePresenter states={states} actions={actions} />
}

export default TransactionTable
