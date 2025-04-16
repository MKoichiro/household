import { NotificationType } from '../../hooks/useContexts'
import { Stack, Typography } from '@mui/material'
import TimerCircularProgress from './TimerCircularProgress'
import Snackbar from './Snackbar'

interface NotificationItemProps {
  notification: NotificationType
  onClose: () => void
}

// 通知表示用コンポーネント
const NotificationItem = ({
  notification: { message, severity, timer: autoHideDuration },
  onClose: handleClose,
}: NotificationItemProps) => {
  // autoHideDurationがundefinedまたは0以下の場合は無制限表示
  const isInfinite = autoHideDuration === undefined || autoHideDuration <= 0

  return (
    <Snackbar severity={severity} open={!!message} autoHideDuration={autoHideDuration} onClose={handleClose}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="body2" color="inherit">
          {message}
        </Typography>
        {!isInfinite && (
          <TimerCircularProgress color="secondary" size="1rem" variant="determinate" duration={autoHideDuration} />
        )}
      </Stack>
    </Snackbar>
  )
}

export default NotificationItem
