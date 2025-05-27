import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  Grid,
  Divider,
  Box,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { compareAsc, parseISO } from 'date-fns'
import type { MouseEvent, ChangeEvent } from 'react'
import { useMemo, useState } from 'react'

import IconComponents from '@components/common/IconComponents'
import { DeleteIcon } from '@icons'
import { useTransaction } from '@shared/hooks/useContexts'
import type { Transaction } from '@shared/types'
import { financeCalculations } from '@shared/utils/financeCalculations'
import { formatCurrency } from '@shared/utils/formatting'
import { cpf } from '@styles/theme/helpers/colorPickers'

// テーブルヘッド部分
interface TransactionTableHeadProps {
  numSelected: number
  onSelectAllClick: (e: ChangeEvent<HTMLInputElement>) => void
  rowCount: number
}

const TransactionTableHead = ({ onSelectAllClick, numSelected, rowCount }: TransactionTableHeadProps) => {
  return (
    <TableHead>
      <TableRow sx={{ '& > *': { whiteSpace: 'nowrap' } }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                'aria-label': 'すべて選択',
              },
            }}
          />
        </TableCell>
        <TableCell align="center">日付</TableCell>
        <TableCell align="center">カテゴリ</TableCell>
        <TableCell align="right">金額</TableCell>
        <TableCell align="left">内容</TableCell>
      </TableRow>
    </TableHead>
  )
}

// ツールバー部分
interface TransactionTableToolbarProps {
  numSelected: number
  onDeleteClick: (e: MouseEvent<unknown>) => void
}

function TransactionTableToolbar({ numSelected, onDeleteClick }: TransactionTableToolbarProps) {
  return (
    <Box
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, mt: 1, display: 'flex' },
        numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {/* "* selected" Or Title */}
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">
          月の収支
        </Typography>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDeleteClick}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  )
}

export interface TransactionTableProps {
  monthlyTransactions: Transaction[]
}

const TransactionTable = ({ monthlyTransactions: transactions }: TransactionTableProps) => {
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { handleDeleteTransaction } = useTransaction()

  const handleSelectAllClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = transactions.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  // ハンドラー
  const handleClick = (_e: MouseEvent<unknown>, id: string) => {
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

  const handleChangePage = (_e: MouseEvent<HTMLButtonElement, unknown> | null, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10))
    setPage(0)
  }

  const handleDeleteClick = (_e: MouseEvent<unknown>) => {
    void handleDeleteTransaction(selected)
    setSelected([])
  }

  // 最終ページのパディング用の空行数を計算
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0

  const visibleRows = useMemo(
    () =>
      [...transactions]
        .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, transactions]
  )

  const { income, expense, balance } = financeCalculations(transactions)

  return (
    <>
      {/* 月次サマリー表示部分 */}
      <Grid container sx={{ textAlign: 'center' }}>
        {[
          { title: '支出', color: cpf('expense.font.lighter'), amount: formatCurrency(expense) },
          { title: '収入', color: cpf('income.font.lighter'), amount: formatCurrency(income) },
          { title: '残高', color: cpf('balance.font.lighter'), amount: formatCurrency(balance) },
        ].map((item) => (
          <Grid key={item.title} size={{ xs: 4 }}>
            <Typography variant="subtitle1" component="h3">
              {item.title}
            </Typography>
            <Typography
              component="span"
              fontWeight="fontWeightBold"
              sx={{
                color: item.color,
                fontSize: '1.6rem',
                wordBreak: 'break-word',
              }}
            >
              ￥{item.amount}
            </Typography>
          </Grid>
        ))}
      </Grid>

      <Divider />

      {/* ヘッダーツールバー部分 */}
      <TransactionTableToolbar onDeleteClick={handleDeleteClick} numSelected={selected.length} />

      {/* テーブル本体部分 */}
      <TableContainer>
        <Table
          aria-labelledby="tableTitle"
          size="medium"
          sx={{ 'td, th': { fontSize: '1.6rem', tableLayout: 'fixed' } }}
        >
          {/* ここで列幅だけ定義 ★ */}
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
                  onClick={(e) => handleClick(e, t.id)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={t.id}
                  selected={isItemSelected}
                  sx={{ cursor: 'pointer' }}
                >
                  {/* 各カラムをhardyにコーディング */}
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      slotProps={{ input: { 'aria-labelledby': labelId } }}
                    />
                  </TableCell>

                  {/* 日付 */}
                  <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ whiteSpace: 'nowrap' }}>
                    {t.date}
                  </TableCell>

                  {/* カテゴリ */}
                  <TableCell align="left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {IconComponents[t.category]}
                      <span
                        style={{ maxWidth: '5em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {t.category}
                      </span>
                    </div>
                  </TableCell>

                  {/* 金額 */}
                  <TableCell align="right" sx={{ color: cpf(`${t.type}.font.lighter`) }}>
                    {t.amount}
                  </TableCell>

                  {/* 内容 */}
                  <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
                    {t.content}
                  </TableCell>
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
      </TableContainer>

      {/* ページネーション用ツールバー部分 */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={transactions.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          '& .MuiTablePagination-toolbar': { fontSize: '1.4rem' },
          '& .MuiTablePagination-displayedRows': { fontSize: '1.4rem' },
          '& .MuiTablePagination-selectLabel': { fontSize: '1.4rem' },
          '& .MuiTablePagination-selectIcon': { fontSize: '2rem' },
        }}
      />
    </>
  )
}

export default TransactionTable
