import styled from '@emotion/styled'
import { CSSProperties, FormEvent, ReactNode } from 'react'
import { Box, Button, ButtonProps, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLayout } from '../shared/hooks/useContexts'

interface RootProps {
  children: ReactNode
}

const Root = ({ children }: RootProps) => {
  const { dynamicHeaderHeight } = useLayout()
  return (
    <AuthPagesRoot $dynamicHeaderHeight={dynamicHeaderHeight}>
      <Paper elevation={3} sx={{ width: { xs: '100%', sm: 400, md: 600 }, p: 4 }}>
        {children}
      </Paper>
    </AuthPagesRoot>
  )
}

const AuthPagesRoot = styled.div<{ $dynamicHeaderHeight: CSSProperties['height'] }>`
  height: calc(100% - ${({ $dynamicHeaderHeight }) => $dynamicHeaderHeight});
  display: flex;
  justify-content: center;
  align-items: center;
`

interface FormProps {
  title: string
  buttonText: string
  children: ReactNode
  isSubmitting: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

const Form = ({ children, title, buttonText, isSubmitting, onSubmit: handleSubmit }: FormProps) => {
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1">
          {title}
        </Typography>

        {children}

        <Button type="submit" variant="contained" color="primary" disabled={isSubmitting} fullWidth>
          {isSubmitting ? '通信中...' : buttonText}
        </Button>
      </Stack>
    </Box>
  )
}

type NavigateButtonProps = Omit<ButtonProps, 'onClick'> & {
  path: string
  innerText: ReactNode
}

const NavigateButton = ({ path, innerText, ...rest }: NavigateButtonProps) => {
  const { sx, ...otherRest } = rest
  const navigate = useNavigate()

  const handleClick = () => void navigate(path, { replace: true })

  return (
    <Button {...otherRest} onClick={handleClick} color="secondary" sx={{ ...sx, display: 'block', ml: 'auto' }}>
      {innerText}
    </Button>
  )
}

export { Root, Form, NavigateButton }
