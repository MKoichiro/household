import { useTheme } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'

import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { useRemToPx } from '@shared/hooks/useRemToPx'

// ガード
const isPureNum = (value: string | number): value is number => typeof value === 'number'
const isRemUnit = (value: string | number): value is string => typeof value === 'string' && value.endsWith('rem')
const isPxUnit = (value: string | number): value is string => typeof value === 'string' && value.endsWith('px')

// ヘルパー
const formatHeight = (value: string | number, remConverter: (arg: number) => number): number => {
  if (isPureNum(value)) {
    return value
  } else if (isRemUnit(value)) {
    return remConverter(parseFloat(value))
  } else if (isPxUnit(value)) {
    return parseInt(value, 10) // 10進数でパース、単位も自動で切り捨てる
  }
  throw new Error(
    `theme.height.header*[bp]は、remまたはpx単位のstring型, またはnumber型にしてください。: ${String(value)}`
  )
}

/**
 * @internal
 * newsBar 表示中に、スクロール量に応じてコンテキストメニューの位置を微調整するためのカスタムフック。
 *
 * @param isContextMenuOpen - コンテキストメニューが開いているかどうか
 * @param isNewsOpen - ニュースバーが開いているかどうか
 * @returns メニューの位置スタイルとニュースバーの参照
 */
const useContextMenuTop = ({ isContextMenuOpen, isNewsOpen }: { isContextMenuOpen: boolean; isNewsOpen: boolean }) => {
  const { remToPx } = useRemToPx()
  const menuNetMargin = remToPx(1)

  const newsBarRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const { bp } = useBreakpoint()
  const headerNewsHeight = formatHeight(theme.height.headerNews[bp], remToPx)
  const headerHeight = formatHeight(theme.height.header[bp], remToPx)
  const initialMenuTop = headerHeight + menuNetMargin + (isNewsOpen ? headerNewsHeight : 0)
  const [menuTop, setMenuTop] = useState(initialMenuTop)
  const positionStyle = { top: menuTop, right: menuNetMargin }
  const ticking = useRef(false)

  useEffect(() => {
    if (!isContextMenuOpen || !isNewsOpen) return

    const options: IntersectionObserverInit = {
      root: null, // ビューポートをルートとして使用
      threshold: Array.from({ length: 21 }, (_, i) => i / 20), // [0, 0.x, ..., 1]
      rootMargin: `0px 0px ${headerNewsHeight}px 0px`,
    }
    const elCopy = newsBarRef.current
    const callback = (entries: IntersectionObserverEntry[]) => {
      if (ticking.current) return // すでにリクエストアニメーションフレームが走っている場合は無視
      const ratio = entries[0].intersectionRatio
      window.requestAnimationFrame(() => {
        setMenuTop(headerHeight + headerNewsHeight * ratio + menuNetMargin)
        ticking.current = false // リクエストアニメーションフレームが完了したらフラグをリセット
      })
      ticking.current = true // リクエストアニメーションフレームをリクエストしたのでフラグを立てる
    }
    const observer = new IntersectionObserver(callback, options)
    if (elCopy) observer.observe(elCopy)
    return () => {
      if (elCopy) observer.unobserve(elCopy)
    }
  }, [headerHeight, headerNewsHeight, isContextMenuOpen, isNewsOpen, menuNetMargin])

  return { positionStyle, newsBarRef }
}

export default useContextMenuTop
