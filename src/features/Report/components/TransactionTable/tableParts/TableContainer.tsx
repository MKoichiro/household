import { TableContainer as MuiTableContainer, Table, TableBody, TableCell, TableRow } from '@mui/material'
import type { ChangeEvent, MouseEventHandler } from 'react'

import type { Transaction } from '@shared/types'

import * as TC from './tableBodyCells'
import TransactionTableHead from './TableHead'

interface TableContainerProps {
  selected: readonly string[]
  transactions: Transaction[]
  visibleRows: Transaction[]
  emptyRows: number
  onSelectAllClick: (e: ChangeEvent<HTMLInputElement>) => void
  onRowClick: (id: string) => MouseEventHandler<HTMLTableRowElement>
}

const TableContainer = ({
  selected,
  transactions,
  visibleRows,
  emptyRows,
  onSelectAllClick: handleSelectAllClick,
  onRowClick: handleClick,
}: TableContainerProps) => {
  return (
    <MuiTableContainer>
      <Table aria-labelledby="tableTitle" size="medium" sx={{ 'td, th': { fontSize: '1.6rem', tableLayout: 'fixed' } }}>
        {/* ここで列幅だけ定義 */}
        <colgroup>
          {[
            { name: 'checkbox', style: { width: '2rem' } },
            { name: 'date', style: { width: '1%' } },
            { name: 'category', style: { width: '1%', maxWidth: '7em' } },
            { name: 'amount', style: { width: '1%' } },
            { name: 'content', style: {} },
          ].map((col) => (
            <col key={col.name} style={col.style} className={`col-${col.name}`} />
          ))}
        </colgroup>

        {/* テーブルヘッド */}
        <TransactionTableHead
          numSelected={selected.length}
          onSelectAllClick={handleSelectAllClick}
          rowCount={transactions.length}
        />

        {/* テーブルボディ */}
        <TableBody>
          {/* レコードでイテレートして行を定義 */}
          {visibleRows.map((t, index) => {
            const isItemSelected = selected.includes(t.id)
            const labelId = `enhanced-table-checkbox-${index}`

            return (
              // 一行の定義部分
              <TableRow
                hover
                onClick={handleClick(t.id)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={t.id}
                selected={isItemSelected}
                sx={{ cursor: 'pointer' }}
              >
                <TC.Checkbox isItemSelected={isItemSelected} labelId={labelId} />
                <TC.Date transaction={t} labelId={labelId} />
                <TC.Category transaction={t} />
                <TC.Amount transaction={t} />
                <TC.Content transaction={t} />
              </TableRow>
            )
          })}

          {/* パディング用の空行定義部分 */}
          {emptyRows > 0 && (
            <TableRow sx={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </MuiTableContainer>
  )
}

export default TableContainer
