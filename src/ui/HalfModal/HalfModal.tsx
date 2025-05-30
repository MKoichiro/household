import styled from '@emotion/styled'
import type { CSSProperties, ReactNode } from 'react'
import type { SwipeableHandlers } from 'react-swipeable'

import Backdrop from '@ui/Backdrop'
import { usePortal } from '@shared/hooks/useContexts'

interface HalfModalProps {
  isOpen: boolean
  children: ReactNode
  register: {
    handleClose: () => void
    swipeHandlers: SwipeableHandlers
    style: CSSProperties
    zIndex: CSSProperties['zIndex']
    backdropRef: (el: HTMLElement | null) => void
  }
}

export const HalfModal = ({
  isOpen,
  children,
  register: { swipeHandlers, handleClose, style, zIndex, backdropRef },
}: HalfModalProps) => {
  const portalRenderer = usePortal('half-modal')

  return (
    <>
      {portalRenderer(
        <>
          <Backdrop ref={backdropRef} $open={isOpen} $zIndex={(zIndex as number) - 1} onClick={handleClose} />
          <div style={style}>
            <SwipeHandle {...swipeHandlers} />
            {children}
          </div>
        </>
      )}
    </>
  )
}

// スワイプダウンで閉じるためのハンドルバー
const SwipeHandle = styled.div`
  /* 矩形を大きめ定義した本体でスワイプ判定を受け取り、インジケーターは疑似要素で描画 */
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1.25rem;
  margin-top: 0.75rem;
  padding: 1rem 0;
  border-radius: 0.25rem;
  touch-action: none; /* iOS の既定ジェスチャーを抑制 */
  cursor: grab;
  &:active {
    cursor: grabbing;
    transform: scale(0.95);
    transition: transform 100ms ease;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 7.5rem;
    height: 0.5rem;
    background-color: ${({ theme }) => theme.palette.text.disabled};
    border-radius: 0.5rem;
  }
`
