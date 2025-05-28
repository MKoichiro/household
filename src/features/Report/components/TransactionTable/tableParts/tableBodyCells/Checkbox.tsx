import { TableCell } from '@mui/material'
import { Checkbox as MuiCheckbox } from '@mui/material'

const Checkbox = ({ isItemSelected, labelId }: { isItemSelected: boolean; labelId: string }) => {
  return (
    <TableCell padding="checkbox">
      <MuiCheckbox color="primary" checked={isItemSelected} slotProps={{ input: { 'aria-labelledby': labelId } }} />
    </TableCell>
  )
}

export default Checkbox
