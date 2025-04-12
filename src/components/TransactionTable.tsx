import { alpha } from '@mui/material/styles'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Grid,
  Divider,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Transaction } from '../types'
import { useMemo, useState, MouseEvent, ChangeEvent } from 'react'
import { financeCalculations } from '../utils/financeCalculations'
import { formatCurrency } from '../utils/formatting'
import IconComponents from './common/IconComponents'
import { compareAsc, parseISO } from 'date-fns'

// テーブルヘッド部分
interface TransactionTableHeadProps {
  numSelected: number
  onSelectAllClick: (e: ChangeEvent<HTMLInputElement>) => void
  rowCount: number
}

const TransactionTableHead = ({ onSelectAllClick, numSelected, rowCount }: TransactionTableHeadProps) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>

        <TableCell>日付</TableCell>
        <TableCell>カテゴリ</TableCell>
        <TableCell>金額</TableCell>
        <TableCell>内容</TableCell>
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
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {/* "* selected" Or Title*/}
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
    </Toolbar>
  )
}

interface TransactionTableProps {
  monthlyTransactions: Transaction[]
  onDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>
}

const TransactionTable = ({ monthlyTransactions: transactions, onDeleteTransaction }: TransactionTableProps) => {
  const [selected, setSelected] = useState<readonly string[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleSelectAllClick = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const newSelected = transactions.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  // MEMO: 使っていないが、残しておきたい引数は_で始めると、noUnusedParametersのオプションによるパーサーエラーを回避できる
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
    onDeleteTransaction(selected)
    setSelected([])
  }

  // Avoid a layout jump when reaching the last page with empty rows.
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
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%' }}>
        <Grid container sx={{ textAlign: 'center' }}>
          {[
            {
              title: '支出',
              color: 'expenseColor.main',
              amount: formatCurrency(expense),
            },
            {
              title: '収入',
              color: 'incomeColor.main',
              amount: formatCurrency(income),
            },
            {
              title: '残高',
              color: 'balanceColor.dark',
              amount: formatCurrency(balance),
            },
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
                  fontSize: {
                    xs: '.8rem',
                    sm: '1rem',
                    md: '1.2rem',
                  },
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
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
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
                    onClick={(event) => handleClick(event, t.id)}
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
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
                      />
                    </TableCell>

                    {/* 日付 */}
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {t.date}
                    </TableCell>

                    {/* カテゴリ */}
                    <TableCell
                      align="left"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      {IconComponents[t.category]}
                      {t.category}
                    </TableCell>

                    {/* 金額 */}
                    <TableCell
                      align="left"
                      sx={{
                        color: t.type === 'income' ? 'incomeColor.main' : 'expenseColor.main',
                      }}
                    >
                      {t.amount}
                    </TableCell>

                    {/* 内容 */}
                    <TableCell align="left">{t.content}</TableCell>
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
        />
      </Paper>
    </Box>
  )
}

export default TransactionTable
