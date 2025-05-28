import { Checkbox, TableCell, TableHead, TableRow } from '@mui/material'
import type { ChangeEvent } from 'react'

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

export default TransactionTableHead
