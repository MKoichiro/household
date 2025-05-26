import { ReactNode, HTMLAttributes } from 'react'
import styled from '@emotion/styled'
import ErrorOutline from '@mui/icons-material/ErrorOutline'
import WarningAmber from '@mui/icons-material/WarningAmber'
import InfoOutline from '@mui/icons-material/InfoOutline'
import TaskAlt from '@mui/icons-material/TaskAlt'
import Close from '@mui/icons-material/Close'
import { AlertColor } from '@mui/material'
import { cp } from '../../../styles/theme/helpers/colorPickers'

interface SnackbarProps extends HTMLAttributes<HTMLDivElement> {
  severity: AlertColor
  open: boolean
  onClose: () => void
  children: ReactNode
}

const severityIconMap: Record<AlertColor, ReactNode> = {
  error: <ErrorOutline />,
  warning: <WarningAmber />,
  info: <InfoOutline />,
  success: <TaskAlt />,
}

const Snackbar = ({
  className,
  severity,
  open,
  onClose: handleClose,
  onClick: handleClick,
  children,
}: SnackbarProps) => {
  if (!open) return null

  return (
    <StyledSnackbar className={className} $severity={severity} onClick={handleClick}>
      <StyledAlert $severity={severity}>
        {severityIconMap[severity]}
        <span>{children}</span>
        <button onClick={handleClose}>
          <Close />
        </button>
      </StyledAlert>
    </StyledSnackbar>
  )
}

const StyledSnackbar = styled.div<{ $severity: AlertColor }>`
  width: 100%;
  padding: 0.75rem 1.25rem;
  background-color: ${({ theme, $severity }) => cp(theme, `ui.snackBar.${$severity}.bg`)};
  border-radius: 0.8rem;
`

const StyledAlert = styled.div<{ $severity: AlertColor }>`
  font-size: inherit;
  display: flex;
  align-items: center;
  gap: 1rem;
  max-height: 4rem;

  span {
    /* ２行に収まらなければ...で省略 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  button {
    cursor: pointer;
    display: flex;
    margin-left: auto;
    align-items: center;
    background: none;
    border: none;
    padding: 0;
    height: auto;
    width: auto;
    color: inherit;
    svg {
      padding: 0.1rem;
      margin-left: 1rem;
      display: block;
      color: ${({ theme }) => cp(theme, 'ui.snackBar.closeBtn')};
    }
  }

  svg {
    color: ${({ theme, $severity }) => cp(theme, `ui.snackBar.${$severity}.icon`)};
    height: 1em;
    width: 1em;
  }
`

export default Snackbar
