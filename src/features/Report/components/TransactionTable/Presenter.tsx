import { Divider } from '@mui/material'
import type { ChangeEvent, MouseEvent, MouseEventHandler } from 'react'

import type { SummaryFormatted, Transaction } from '@shared/types'

import * as TP from './tableParts'

interface TransactionTableStates {
  summaryFormatted: SummaryFormatted
  selected: readonly string[]
  transactions: Transaction[]
  visibleRows: Transaction[]
  emptyRows: number
  rowsPerPage: number
  page: number
}

interface TransactionTableActions {
  onDeleteClick: () => void
  onSelectAllClick: (e: ChangeEvent<HTMLInputElement>) => void
  onRowClick: (id: string) => MouseEventHandler<HTMLTableRowElement>
  onPageChange: (e: MouseEvent<HTMLButtonElement> | null, page: number) => void
  onRowsPerPageChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export interface TransactionTablePresenterProps {
  states: TransactionTableStates
  actions: TransactionTableActions
}

const TransactionTablePresenter = ({ states, actions }: TransactionTablePresenterProps) => {
  const { summaryFormatted, selected, transactions, visibleRows, emptyRows, rowsPerPage, page } = states

  const {
    onDeleteClick: handleDeleteClick,
    onSelectAllClick: handleSelectAllClick,
    onRowClick: handleClick,
    onPageChange: handleChangePage,
    onRowsPerPageChange: handleChangeRowsPerPage,
  } = actions

  return (
    <>
      {/* 月次サマリー部分 */}
      <TP.MonthlySummary summaryFormatted={summaryFormatted} />
      <Divider />

      {/* ヘッダーツールバー部分 */}
      <TP.Toolbar onDeleteClick={handleDeleteClick} numSelected={selected.length} />

      {/* テーブル本体部分 */}
      <TP.Container
        selected={selected}
        transactions={transactions}
        visibleRows={visibleRows}
        emptyRows={emptyRows}
        onSelectAllClick={handleSelectAllClick}
        onRowClick={handleClick}
      />

      {/* ページネーション用ツールバー部分 */}
      <TP.Pagination
        transactions={transactions}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  )
}

export default TransactionTablePresenter
