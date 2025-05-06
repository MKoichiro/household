import { RefObject, useEffect } from 'react'

const useClickAway = (refs: (RefObject<HTMLElement | null> | undefined)[], callback: () => void) => {
  useEffect(() => {
    const handleClickAway = (e: MouseEvent) => {
      // refs のいずれかにも含まれない要素がクリックされた場合のみ、コールバックを実行
      if (!refs.some((ref) => ref === undefined || ref.current?.contains(e.target as Node))) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClickAway)
    return () => {
      document.removeEventListener('mousedown', handleClickAway)
    }
  }, [refs, callback])
}

export default useClickAway
