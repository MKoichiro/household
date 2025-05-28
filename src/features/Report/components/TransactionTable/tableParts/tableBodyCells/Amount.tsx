import { TableCell } from '@mui/material'

import type { Transaction } from '@shared/types'
import { cpf } from '@styles/theme/helpers/colorPickers'

const Amount = ({ transaction: t }: { transaction: Transaction }) => {
  return (
    <TableCell align="right" sx={{ color: cpf(`${t.type}.font.lighter`) }}>
      {t.amount}
    </TableCell>
  )
}

export default Amount
