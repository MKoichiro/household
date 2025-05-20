import { NotificationType } from '../../../shared/hooks/useContexts'
import { Stack, Typography } from '@mui/material'
import TimerCircularProgress from '../TimerCircularProgress'
import Snackbar from './Snackbar'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'

interface NotificationItemProps {
  isOne: boolean
  notification: NotificationType
  onClose: () => void
}

// 通知表示用コンポーネント
const Notification = ({
  isOne,
  notification: { id, message, severity, timer: autoHideDuration },
  onClose: handleClose,
}: NotificationItemProps) => {
  // autoHideDuration が undefined または 0 以下の場合は無制限表示
  const isInfinite = autoHideDuration === undefined || autoHideDuration <= 0
  // const isInfinite = true

  return (
    <motion.div
      initial={{ x: '-110%', maxHeight: '4rem' }}
      animate={{ x: 0, maxHeight: '4rem', transition: { duration: 0.4 } }}
      exit={{
        x: [0, '-110%', '-110%'],
        maxHeight: ['4rem', '4rem', 0],
        transition: { duration: 0.4, times: [0, 0.5, 1], ease: 'easeOut' },
      }}
    >
      <StyledSnackbar
        className={id}
        isOne={isOne}
        severity={severity}
        open={!!message}
        autoHideDuration={autoHideDuration}
        onClose={handleClose}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="inherit">
            {message}
          </Typography>
          {!isInfinite && (
            <TimerCircularProgress
              size="1rem"
              variant="determinate"
              duration={autoHideDuration}
              sx={{
                color: (theme) => theme.palette.ui.snackBar[severity].icon[theme.palette.mode],
              }}
            />
          )}
        </Stack>
      </StyledSnackbar>
    </motion.div>
  )
}

export default Notification

const StyledSnackbar = styled(Snackbar)<{ isOne: boolean }>`
  margin-top: ${({ isOne }) => (isOne ? '0' : '0.5rem')};
  margin-bottom: ${({ isOne }) => (isOne ? '0' : '0.5rem')};
  p {
    font-size: 1.4rem;
  }
`
