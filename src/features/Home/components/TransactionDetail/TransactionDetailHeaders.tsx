import { IconButton, Stack, Typography } from '@mui/material'
import { CloseIcon } from '../../../../icons'
import { useApp } from '../../../../shared/hooks/useContexts'
import { format } from 'date-fns'

const TransactionDetailHeaderModal = ({ onClose: handleModalClose }: { onClose: () => void }) => {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <TransactionDetailHeaderBase />

      {/* 以下閉じるボタン */}
      <IconButton aria-label="閉じる" sx={{ color: (theme) => theme.palette.grey[500] }} onClick={handleModalClose}>
        <CloseIcon />
      </IconButton>
    </Stack>
  )
}

const TransactionDetailHeaderBase = () => {
  const { selectedDay } = useApp()
  return (
    <Typography variant="h6" fontWeight={'fontWeightBold'}>
      {format(selectedDay, 'M月 d日')}
    </Typography>
  )
}

export { TransactionDetailHeaderBase as Base, TransactionDetailHeaderModal as Modal }
