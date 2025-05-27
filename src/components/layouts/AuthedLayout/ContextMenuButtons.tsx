import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { Link } from 'react-router-dom'

import { cp } from '@styles/theme/helpers/colorPickers'

export const PageLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`

export const LogoutButton = styled(Button)`
  --common-color: ${({ theme }) => cp(theme, 'ui.header.contrastText')};
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0;
  padding-left: 0;
  color: var(--common-color);
  border-color: var(--common-color);
  font-size: 1.4rem;
  line-height: 3em;
  height: 3em;
  font-weight: 400;
`
