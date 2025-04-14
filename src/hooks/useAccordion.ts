import { useState, useEffect, useRef, createRef, RefObject } from 'react'
import { debounce } from '../utils/debounce'

// 単一のhead-contentペアのみの場合(要らない？？？)
export const useAccordion = (defaultState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(defaultState)
  const [contentHeight, setContentHeight] = useState(0)

  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = contentRef?.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      if (entries.length === 0) return
      const entry = entries[0]
      setContentHeight(entry.target.scrollHeight)
    })

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [contentRef])

  return {
    contentRef,
    isOpen,
    contentHeight,
    toggle: () => setIsOpen((prev) => !prev),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  }
}

// 複数のhead-contentペアがあり、独立して管理する場合
export const useAccordions = (numSections: number, defaultStates: boolean | boolean[] = false) => {
  const initialStates = Array.isArray(defaultStates) ? defaultStates : Array(numSections).fill(defaultStates)
  const [isOpens, setIsOpens] = useState<boolean[]>(initialStates)
  const [contentHeights, setContentHeights] = useState<number[]>(Array(numSections).fill(0))

  // 各セクション用のrefを配列で用意
  const refs = useRef<RefObject<HTMLDivElement | null>[]>([])
  for (let i = 0; i < numSections; i++) {
    if (!refs.current[i]) {
      refs.current[i] = createRef<HTMLDivElement>()
    }
  }

  useEffect(() => {
    const currentRefs = refs.current
    const observers = currentRefs.map((ref) => {
      const element = ref.current
      if (!element) return null

      // ResizeObserverのコールバック関数をデバウンスするための関数
      const debouncedSetContentHeight = debounce((entry: ResizeObserverEntry) => {
        setContentHeights((prevHeights) => {
          const newHeights = [...prevHeights]
          newHeights[currentRefs.indexOf(ref)] = entry.target.scrollHeight
          return newHeights
        })
      }, 100) // 100msのデバウンス時間を設定

      const observer = new ResizeObserver((entries) => {
        if (entries.length === 0) return
        const entry = entries[0]
        // デバウンスを適用
        debouncedSetContentHeight(entry)
      })

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer, index) => {
        if (observer && currentRefs[index].current) {
          observer.unobserve(currentRefs[index].current)
        }
      })
    }
  }, [refs])

  const toggle = (index: number) => {
    return () => {
      setIsOpens((prev) => {
        const newOpens = [...prev]
        newOpens[index] = !newOpens[index]
        return newOpens
      })
    }
  }

  const open = (index: number) => {
    return () => {
      setIsOpens((prev) => {
        const newOpens = [...prev]
        newOpens[index] = true
        return newOpens
      })
    }
  }

  const close = (index: number) => {
    return () => {
      setIsOpens((prev) => {
        const newOpens = [...prev]
        newOpens[index] = false
        return newOpens
      })
    }
  }

  // 他のセクションを閉じて、指定したセクションだけを開く
  const controlledToggle = (index: number) => {
    return () => {
      setIsOpens((prev) => {
        const newOpens = Array(numSections).fill(false) as boolean[]
        newOpens[index] = !prev[index]
        return newOpens
      })
    }
  }

  return {
    contentRefs: refs.current,
    isOpens,
    contentHeights,
    toggle,
    controlledToggle,
    open,
    close,
  }
}
