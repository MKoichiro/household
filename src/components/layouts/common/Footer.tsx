import styled from '@emotion/styled'
import { XIcon } from '../../../icons'
import { cp } from '../../../styles/theme/helpers/colorPickers'
import { useLayout } from '../../../shared/hooks/useContexts'

const Footer = () => {
  const { isNavigationMenuOpen } = useLayout()
  return (
    <FooterRoot $isNavigationMenuOpen={isNavigationMenuOpen}>
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

const FooterRoot = styled.footer<{ $isNavigationMenuOpen: boolean }>`
  height: ${({ theme }) => theme.height.footer.xs};
  background-color: ${({ theme }) => cp(theme, 'ui.footer.bg')};
  color: ${({ theme }) => cp(theme, 'ui.footer.contrastText')};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: ${({ theme, $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.xs : '0')};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: ${({ theme }) => theme.height.footer.sm};
    margin-left: ${({ theme, $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.sm : '0')};
  }
  ${({ theme }) => theme.breakpoints.up('md')} {
    height: ${({ theme }) => theme.height.footer.md};
    margin-left: ${({ theme, $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? theme.width.navigationMenu.md : '0')};
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    height: ${({ theme }) => theme.height.footer.lg};
    margin-left: 0;
  }
  ${({ theme }) => theme.breakpoints.up('xl')} {
    height: ${({ theme }) => theme.height.footer.xl};
  }
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
  margin: 0 1rem;
`

export default Footer
