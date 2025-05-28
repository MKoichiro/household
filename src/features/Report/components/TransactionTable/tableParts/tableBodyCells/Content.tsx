import { TableCell } from '@mui/material'

import type { Transaction } from '@shared/types'

const Content = ({ transaction: t }: { transaction: Transaction }) => {
  return (
    <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
      {t.content ? t.content : '---'}
    </TableCell>
  )
}

export default Content
