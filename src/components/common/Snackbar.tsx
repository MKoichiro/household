import { useEffect, ReactNode } from 'react'
import styled from 'styled-components'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import WarningAmber from '@mui/icons-material/WarningAmber'
import InfoOutline from '@mui/icons-material/InfoOutline'
import TaskAlt from '@mui/icons-material/TaskAlt'
import Close from '@mui/icons-material/Close'
import { AlertColor } from '@mui/material'
import { theme } from '../../theme/theme'

const severityIconMap: Record<AlertColor, ReactNode> = {
  error: <ErrorOutline />,
  warning: <WarningAmber />,
  info: <InfoOutline />,
  success: <TaskAlt />,
}

const StyledSnackbar = styled.div<{ severity: AlertColor }>`
  /* position: fixed; */
  /* bottom: 1rem; */
  /* left: 1rem; */
  /* z-index: 1400; */
  width: 100%;
  /* margin: 4px 0 0 0; */
  padding: 0.5rem 1rem;
  background-color: ${({ severity }) => theme.palette[severity].light};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 1rem;
`

const StyledAlert = styled.div<{ severity: AlertColor }>`
  font-size: inherit;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    cursor: pointer;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    height: auto;
    width: auto;
    svg {
      display: block;
      color: inherit;
    }
  }

  svg {
    color: ${({ severity }) => theme.palette[severity].main};
    height: 1em;
    width: 1em;
  }
`

const Snackbar = ({
  severity,
  open,
  autoHideDuration,
  onClose,
  children,
}: {
  severity: AlertColor
  open: boolean
  autoHideDuration?: number
  onClose: () => void
  children: ReactNode
}) => {
  useEffect(() => {
    if (open) {
      // autoHideDurationがundefinedまたは0以下の場合は無制限表示
      if (autoHideDuration === undefined || autoHideDuration <= 0) return
      // autoHideDurationが指定されている場合は、指定された時間後にonCloseを呼び出す
      const timer = setTimeout(() => {
        onClose()
      }, autoHideDuration)
      return () => clearTimeout(timer)
    }
  }, [open, autoHideDuration, onClose])

  if (!open) return null

  return (
    <StyledSnackbar severity={severity}>
      <StyledAlert severity={severity}>
        {severityIconMap[severity]}
        <span>{children}</span>
        <button onClick={onClose}>
          <Close />
        </button>
      </StyledAlert>
    </StyledSnackbar>
  )
}

export default Snackbar
