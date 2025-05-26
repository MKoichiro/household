import { NotificationType } from '../../../shared/hooks/useContexts'
import { CircularProgress, Stack, Typography } from '@mui/material'
import Snackbar from './Snackbar'
import { motion } from 'framer-motion'
import styled from '@emotion/styled'
import { useRemToPx } from '../../../shared/hooks/useRemToPx'
import { useEffect, useState } from 'react'
import useTimer from '../../../shared/hooks/useTimer'
import { cpf } from '../../../styles/theme/helpers/colorPickers'

const slideVariants = {
  initial: { x: '-110%', maxHeight: '4rem' },
  animate: { x: 0, maxHeight: '4rem', transition: { duration: 0.4 } },
  exit: {
    x: [0, '-110%', '-110%'],
    maxHeight: ['4rem', '4rem', 0],
    transition: { duration: 0.4, times: [0, 0.5, 1], ease: 'easeOut' },
  },
}

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
  const { remToPx } = useRemToPx()
  const [aborted, setAborted] = useState(false)

  const delay = 200
  const decideStep = () => (!isInfinite ? (delay / autoHideDuration) * 100 : undefined)
  const step = decideStep()
  const { count, stop, kill, start } = useTimer({ init: 100, step, type: 'decrement', delay, startNow: false })

  const handleSnackbarClick = () => {
    if (isInfinite) return
    stop()
    setAborted(true)
  }

  // 初回レンダリング時に自動で開始
  useEffect(() => {
    if (!isInfinite) start()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 自動で閉じる処理
  useEffect(() => {
    if (!isInfinite && count <= 0) {
      handleClose()
      kill()
    }
  }, [count, isInfinite, handleClose, kill])

  // 手動で閉じるためのハンドラ
  const handleSnackbarClose = () => {
    handleClose()
    kill()
  }

  return (
    <motion.div variants={slideVariants} initial="initial" animate="animate" exit="exit">
      <StyledSnackbar
        className={id}
        isOne={isOne}
        severity={severity}
        open={!!message}
        onClose={handleSnackbarClose}
        onClick={handleSnackbarClick}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="inherit">
            {message}
          </Typography>
          {!isInfinite && (
            <StyledCircularProgress
              size={remToPx(1.6)}
              variant="determinate"
              value={count >= 0 ? count : 0}
              $aborted={aborted}
              sx={{ color: cpf(`ui.snackBar.${severity}.icon`) }}
            />
          )}
        </Stack>
      </StyledSnackbar>
    </motion.div>
  )
}

const StyledSnackbar = styled(Snackbar)<{ isOne: boolean }>`
  margin-top: ${({ isOne }) => (isOne ? '0' : '0.5rem')};
  margin-bottom: ${({ isOne }) => (isOne ? '0' : '0.5rem')};
  p {
    font-size: 1.4rem;
  }
`

const StyledCircularProgress = styled(CircularProgress, { shouldForwardProp: (prop) => prop !== '$aborted' })<{
  $aborted: boolean
}>`
  opacity: ${({ $aborted }) => ($aborted ? 0 : 1)};
  transition: opacity 500ms ease;
`

export default Notification
