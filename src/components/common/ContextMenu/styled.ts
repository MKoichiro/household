import styled from '@emotion/styled'
import { css } from '@mui/material'
import { PositionStyle } from './types'
import { CSSProperties } from 'react'
import { motion } from 'framer-motion'

// ContextMenu
const ContextMenuRoot = styled.div<{
  $pos: PositionStyle
  $fixed: boolean
  $zIndex?: CSSProperties['zIndex']
}>`
  font-size: 0.75rem;
  pointer-events: auto;
  position: ${({ $fixed }) => ($fixed ? 'fixed' : 'absolute')};
  z-index: ${({ $zIndex }) => $zIndex ?? 1000};
  top: ${({ $pos }) => ($pos.top != null ? `${$pos.top}px` : 'auto')};
  left: ${({ $pos }) => ($pos.left != null ? `${$pos.left}px` : 'auto')};
  bottom: ${({ $pos }) => ($pos.bottom != null ? `${$pos.bottom}px` : 'auto')};
  right: ${({ $pos }) => ($pos.right != null ? `${$pos.right}px` : 'auto')};
  transform: ${({ $pos }) => $pos.transform ?? 'none'};
`

// MotionContext
const MotionContextBase = styled(motion.div)<{ $transformOrigin: string; $toLeft: boolean }>`
  display: flex;
  transform-origin: ${({ $transformOrigin }) => $transformOrigin};
  flex-direction: ${({ $toLeft }) => ($toLeft ? 'row-reverse' : 'row')};
`

// Nested
const MenuUl = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex-shrink: 0;
  border-radius: 0.25rem;
  min-width: 30vw;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    min-width: 10vw;
  }
  li:first-of-type > button {
    margin-top: 0.5rem;
  }
  li:last-of-type > button {
    margin-bottom: 0.5rem;
  }
`

const CoordinateOrigin = styled.div`
  position: relative;
`

// MenuContent
const liBase = () => css`
  padding: 0;
  margin: 0;
`

const INNER_LI_MARGIN_X = '0.5rem'

const innerLiBase = () => css`
  width: calc(100% - ${INNER_LI_MARGIN_X} * 2);
`

const CoordinateRect = styled.li`
  ${liBase()}
`

const Separator = styled.li`
  ${liBase()}
  hr {
    ${innerLiBase()}
    border: none;
    border-top: 1.6px solid white;
  }
`

const EventRect = styled.button`
  ${innerLiBase()}
  padding: 0.25rem 0.5rem;
  margin: 0.25rem ${INNER_LI_MARGIN_X};
  display: flex;
  align-items: center;
  gap: 1em;
  text-align: left;
  border: none;
  border-radius: 0.25rem;
  background: none;
  color: white;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  svg {
    margin-left: auto;
    font-size: inherit;
  }
`

export { ContextMenuRoot, MotionContextBase, MenuUl, CoordinateOrigin, CoordinateRect, Separator, EventRect }
