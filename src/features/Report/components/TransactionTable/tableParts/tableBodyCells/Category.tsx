import { TableCell } from '@mui/material'

import type { Transaction } from '@shared/types'
import { cpf } from '@styles/theme/helpers/colorPickers'
import IconComponents from '@ui/IconComponents'

const Category = ({ transaction: t }: { transaction: Transaction }) => {
  return (
    <TableCell
      align="left"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        svg: { color: cpf(`${t.type}Category.${t.category}`) },
      }}
    >
      {IconComponents[t.category]}
      <span style={{ maxWidth: '5em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {t.category}
      </span>
    </TableCell>
  )
}

export default Category
