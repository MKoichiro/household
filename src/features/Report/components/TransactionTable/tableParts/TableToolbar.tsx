import { alpha, Box, IconButton, Tooltip, Typography } from '@mui/material'
import type { MouseEvent } from 'react'

import { DeleteIcon } from '@icons'

interface TransactionTableToolbarProps {
  numSelected: number
  onDeleteClick: (e: MouseEvent<unknown>) => void
}

function TableToolbar({ numSelected, onDeleteClick }: TransactionTableToolbarProps) {
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

export default TableToolbar
