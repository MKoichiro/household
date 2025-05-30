import { IconButton, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'

import { CloseIcon } from '@shared/icons'
import { useApp } from '@shared/hooks/useContexts'
import { cpf } from '@styles/theme/helpers/colorPickers'

// PC用ヘッダー
const TransactionDetailHeaderBase = () => {
  const { selectedDay } = useApp()
  return (
    <Typography variant="h6" fontWeight={'fontWeightBold'} sx={{ color: cpf('app.lighterBg.level1.contrastText') }}>
      {format(selectedDay, 'M月 d日')}
    </Typography>
  )
}

// タブレット以下のモーダル用ヘッダー
const TransactionDetailHeaderModal = ({ onClose: handleModalClose }: { onClose: () => void }) => {
  const { selectedDay } = useApp()
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" marginBottom={2}>
      <TransactionDetailHeaderBase />

      {/* 閉じるボタン */}
      <IconButton
        aria-label={`${format(selectedDay, 'M月 d日')}のサマリーを閉じるボタン`}
        onClick={handleModalClose}
        sx={{ color: cpf('app.lighterBg.level1.contrastText') }}
      >
        <CloseIcon />
      </IconButton>
    </Stack>
  )
}

export { TransactionDetailHeaderBase as Base, TransactionDetailHeaderModal as Modal }
