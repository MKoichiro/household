import { CSSProperties, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { useModalScrollLock } from '../../../shared/hooks/useModalScrollLock'

const useSwipeToClose = (isOpen: boolean, handleClose: () => void) => {
  // スワイプ中の移動量(px) とスワイプ中フラグ
  const [deltaY, setDeltaY] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)

  // --- ② handle（ハンドルバー）にのみスワイプ検知を付与 ---
  const swipeHandlers = useSwipeable({
    onSwipeStart: () => {
      setIsSwiping(true)
      setDeltaY(0)
    },
    onSwiping: ({ deltaY: dY, dir }) => {
      if (dir === 'Down') setDeltaY(dY)
    },
    onSwiped: () => {
      // スワイプ終了時は元に戻す（閉じ判定する場合は onSwipedDown で）
      setIsSwiping(false)
      setDeltaY(0)
    },
    onSwipedDown: ({ velocity }) => {
      // 120px 以上引っ張る or 速度が速い場合は閉じる
      if (deltaY > 120 || velocity > 0.5) {
        handleClose()
      } else {
        setIsSwiping(false)
        setDeltaY(0)
      }
    },
    preventScrollOnSwipe: true, // スクロール抑制
    trackMouse: true, // マウス検知
  })

  const swipeAnimeStyle: Pick<CSSProperties, 'transform' | 'transition'> = {
    transform: isOpen
      ? isSwiping
        ? `translateY(${deltaY}px)` // スワイプ中は追従
        : 'translateY(0)' // 通常オープン状態
      : 'translateY(100vh)', // クローズ時は画面外
    transition: isSwiping ? '' : 'transform 300ms ease', // release 後のアニメーション
  }
  return { swipeHandlers, swipeAnimeStyle }
}

export const useHalfModal = (isOpen: boolean, handleClose: () => void, zIndex: CSSProperties['zIndex']) => {
  const { swipeHandlers, swipeAnimeStyle } = useSwipeToClose(isOpen, handleClose)
  const { setModalRef: modalRef, setOverflowableRef: overflowableRef } = useModalScrollLock(isOpen)

  const defaultStyles: Pick<
    CSSProperties,
    'position' | 'top' | 'left' | 'right' | 'bottom' | 'zIndex' | 'height' | 'borderRadius' | 'transition'
  > = {
    position: 'fixed',
    top: '40lvh',
    left: 0,
    right: 0,
    bottom: 'auto',
    zIndex,
    height: '60lvh',
    borderRadius: '1rem 1rem 0 0',
    ...swipeAnimeStyle,
    transition: 'left 300ms ease, ' + swipeAnimeStyle.transition,
  }

  return {
    register: {
      handleClose,
      swipeHandlers,
      style: defaultStyles,
      modalRef,
      zIndex,
    },
    overflowableRef,
  }
}
