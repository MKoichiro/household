import styled from '@emotion/styled'
import { headerHeight } from '../../shared/constants/ui'
import { FormEvent, ReactNode } from 'react'
import { Box, Button, ButtonProps, Paper, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const AuthPagesRoot = styled.div`
  height: calc(100% - ${headerHeight}px);
  display: flex;
  justify-content: center;
  align-items: center;
`

interface RootProps {
  children: ReactNode
}

const Root = ({ children }: RootProps) => {
  return (
    <AuthPagesRoot>
      <Paper elevation={3} sx={{ width: { xs: '100%', sm: 400, md: 600 }, p: 4 }}>
        {children}
      </Paper>
    </AuthPagesRoot>
  )
}

interface FormProps {
  title: string
  children: ReactNode
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
}

const Form = ({ children, title, onSubmit: handleSubmit }: FormProps) => {
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <Typography variant="h5" component="h1">
          {title}
        </Typography>

        {children}

        <Button type="submit" variant="contained" color="primary" fullWidth>
          {title}
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
