// デバイス種別判定のためのカスタムフック
import { useState, useEffect } from 'react'

export type DeviceInputType = 'mouse' | 'touch' | 'pen' | 'unknown'

export const useDeviseInputJudge = (): DeviceInputType => {
  const [inputType, setInputType] = useState<DeviceInputType>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      if (window.matchMedia('(pointer: coarse)').matches) {
        return 'touch'
      }
      if (window.matchMedia('(pointer: fine)').matches) {
        return 'mouse'
      }
    }
    return 'unknown'
  })

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      switch (e.pointerType) {
        case 'mouse':
          setInputType('mouse')
          break
        case 'touch':
          setInputType('touch')
          break
        case 'pen':
          setInputType('pen')
          break
        default:
          setInputType('unknown')
      }
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  return inputType
}
