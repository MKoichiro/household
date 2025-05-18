import styled from '@emotion/styled'
import { footerHeight } from '../../../shared/constants/ui'
import { indigo, purple } from '@mui/material/colors'
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
        <StyledA
          // href="https://x.com/ishihaya0331?s=11&t=9dXL_HkutIzhT2vxZa0gvA"
          target="_blank"
          rel="noopener noreferrer"
        >
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
  background-color: ${purple[200]};
  color: white;
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
  color: ${indigo['A400']};
  text-decoration: none;
  margin: 0 10px;
`
