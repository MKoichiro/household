import styled from '@emotion/styled'
import { alpha, css } from '@mui/material'
import { indigo, purple } from '@mui/material/colors'
import { motion } from 'framer-motion'

const FlowingTextRoot = styled.div<{ $isOverflow: boolean }>`
  overflow: hidden;
  position: relative; // リセットボタンとダミーのオフセット
  cursor: ${({ $isOverflow }) => ($isOverflow ? 'pointer' : 'auto')};
  pointer-events: ${({ $isOverflow }) => ($isOverflow ? 'auto' : 'none')};
`

const ResetButton = styled.button<{ $show: boolean; $side: 'left' | 'right' }>`
  display: ${({ $show }) => ($show ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: ${({ $side }) => ($side === 'left' ? 0 : 'auto')};
  right: ${({ $side }) => ($side === 'right' ? 0 : 'auto')};
  border: none;
  cursor: pointer;
  height: 100%;
  aspect-ratio: 1 / 1;
  background: ${alpha(purple[900], 0.3)};
  color: ${indigo[900]};
  background: black;

  svg {
    display: block;
    width: inherit;
    height: inherit;
  }
`

const FlowingTextContainer = styled(motion.div)<{ $spacerWidth: number }>`
  display: flex;
  margin: 0;
  padding: 0;
  // gap でスペーサーを提供
  gap: ${({ $spacerWidth }) => `${$spacerWidth}px`};
`

// オリジナル/コピー/ダミー 共通スタイル
const flowingTextCommon = css`
  padding: 0;
  margin: 0;
`
// 初期位置用、折り返し省略を表示
const ellipsis = css`
  // 親のコンテナ要素を限界幅として省略
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
`
// x 座標がノンゼロの時のスタイル
const clip = css`
  overflow: visible;
  text-overflow: clip;
  flex-shrink: 0;
`

const FlowingTextOriginal = styled.span<{ $isOverflow: boolean; $isDirty: boolean }>`
  ${flowingTextCommon}
  ${({ $isOverflow, $isDirty }) => {
    if ($isDirty) return clip
    if ($isOverflow) return ellipsis
    return ''
  }}
`
const FlowingTextCopy = styled.span`
  ${flowingTextCommon}
  ${clip}
`

const FlowingTextDummy = styled.span`
  ${flowingTextCommon}
  position: absolute;
  display: block;
  width: auto;
  white-space: nowrap;
  visibility: hidden;
`

export { FlowingTextRoot, ResetButton, FlowingTextContainer, FlowingTextOriginal, FlowingTextCopy, FlowingTextDummy }
