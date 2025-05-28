import { TablePagination as MuiTablePagination } from '@mui/material'
import type { ChangeEvent, MouseEvent } from 'react'

import type { Transaction } from '@shared/types'

interface TablePaginationProps {
  transactions: Transaction[]
  rowsPerPage: number
  page: number
  onPageChange: (e: MouseEvent<HTMLButtonElement> | null, page: number) => void
  onRowsPerPageChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const TablePagination = ({
  transactions,
  rowsPerPage,
  page,
  onPageChange: handleChangePage,
  onRowsPerPageChange: handleChangeRowsPerPage,
}: TablePaginationProps) => {
  return (
    <MuiTablePagination
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
  )
}

export default TablePagination
