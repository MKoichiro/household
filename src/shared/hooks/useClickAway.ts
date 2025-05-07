import { RefObject, useEffect } from 'react'

type ClickAwayTarget = RefObject<HTMLElement | null> | (() => HTMLElement | null)

const useClickAway = (targets: (ClickAwayTarget | undefined)[], callback: () => void) => {
  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      // 存在している要素だけを「内部クリック」とみなす
      const clickedInside = targets.some((t) => {
        const el = typeof t === 'function' ? t() : t?.current
        // null/undefined は false。contains が true の要素だけ「内部」
        return !!el && el.contains(e.target as Node)
      })
      if (!clickedInside) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickAway)
    return () => document.removeEventListener('mousedown', handleClickAway)
  }, [targets, callback])
}

export default useClickAway
