import styled from '@emotion/styled'
import { CSSProperties } from '@mui/material'

const Mask = styled.div<{ $open: boolean; $zIndex: CSSProperties['zIndex'] }>`
  background-color: ${({ theme }) => theme.palette.ui.mask[theme.palette.mode]};
  backdrop-filter: blur(1px);
  opacity: ${({ $open }) => ($open ? 1 : 0)};

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ $zIndex }) => $zIndex};

  pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};

  transition: opacity 1000ms;

  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: none;
  }
`

export default Mask
