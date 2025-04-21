import styled from '@emotion/styled'

const Mask = styled.div<{ $isOpen: boolean; $zIndex: number }>`
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  transition: opacity 1000ms;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: none;
  }
`

export default Mask
