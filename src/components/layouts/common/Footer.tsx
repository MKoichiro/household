import styled from '@emotion/styled'
import { footerHeight } from '../../../shared/constants/ui'

const Footer = () => {
  return <FooterRoot>Footer</FooterRoot>
}

export default Footer

const FooterRoot = styled.footer`
  min-height: ${footerHeight}px;
  background-color: ${({ theme }) => theme.palette.grey[200]};
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`
