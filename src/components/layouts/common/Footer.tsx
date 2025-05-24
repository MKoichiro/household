import styled from '@emotion/styled'
import { footerHeight } from '../../../shared/constants/ui'
import { XIcon } from '../../../icons'

const Footer = () => {
  return (
    <FooterRoot>
      <StyledDiv>
        <StyledA href="https://github.com/MKoichiro/household" target="_blank" rel="noopener noreferrer">
          About
        </StyledA>
        <p> | </p>
        <StyledA href="https://github.com/MKoichiro/household" target="_blank" rel="noopener noreferrer">
          Contact
        </StyledA>
        <p> | </p>
        <StyledA target="_blank" rel="noopener noreferrer">
          <XIcon sx={{ fontSize: '1.25rem', color: 'black' }} />
        </StyledA>
      </StyledDiv>
      <p>© 2025 My Company Name. All rights reserved.</p>
      <p>Privacy Policy | Terms of Service</p>
    </FooterRoot>
  )
}

export default Footer

const FooterRoot = styled.footer`
  min-height: ${footerHeight}px;
  background-color: ${({ theme }) => theme.palette.ui.footer.bg[theme.palette.mode]};
  color: ${({ theme }) => theme.palette.ui.footer.contrastText[theme.palette.mode]};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: auto;
`

const StyledA = styled.a`
  color: black;
  text-decoration: none;
  margin: 0 10px;
`
