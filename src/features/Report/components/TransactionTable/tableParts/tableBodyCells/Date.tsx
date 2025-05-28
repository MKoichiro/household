import { TableCell } from '@mui/material'

import type { Transaction } from '@shared/types'

const Date = ({ transaction: t, labelId }: { transaction: Transaction; labelId: string }) => {
  return (
    <TableCell component="th" id={labelId} scope="row" padding="none" sx={{ whiteSpace: 'nowrap' }}>
      {t.date}
    </TableCell>
  )
}

export default Date
