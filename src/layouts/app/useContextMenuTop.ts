import { useTheme } from '@emotion/react'
import { useEffect, useRef, useState } from 'react'

import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { useRemToPx } from '@shared/hooks/useRemToPx'

const numOfThresholds = 10
const options: IntersectionObserverInit = {
  root: null, // ビューポートをルートとして使用
  threshold: Array.from({ length: numOfThresholds + 1 }, (_, i) => i / numOfThresholds), // [0, 0.x, ..., 1]
  rootMargin: '0px',
}

const menuNetMarginRem = 1 // コンテキストメニューの上（ヘッダー下）と右（ビューポート右端）のマージン（rem単位）

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
  throw new Error(`theme.height.header*[bp]は、remまたはpx単位の文字列, または数値にしてください。: ${String(value)}`)
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
  const menuNetMargin = remToPx(menuNetMarginRem)

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
    if (!isContextMenuOpen || !isNewsOpen) {
      // コンテキストメニューが閉じている間に、newsBar が閉じられた場合は手動で再初期化する
      // なお、initialMenuTop はプリミティブ型なので単に、setMenuTop(initialMenuTop) でも不要な更新はスキップされる。
      setMenuTop((prev) => (prev === initialMenuTop ? prev : initialMenuTop))
      return
    }

    const el = newsBarRef.current

    const adjustMenuTop = (entries: IntersectionObserverEntry[]) => {
      const ratio = entries[0].intersectionRatio

      // 重い環境では、安定時にずれるので、境界では setTimeout を使って間引かずに確実に位置調整を行う。
      if (ratio <= 0.1) {
        setTimeout(() => {
          setMenuTop(headerHeight + menuNetMargin)
        }, 0)
      } else if (ratio >= 0.9) {
        setTimeout(() => {
          setMenuTop(headerHeight + headerNewsHeight + menuNetMargin)
        }, 0)
      }

      if (ticking.current) return // すでにリクエストアニメーションフレームが走っている場合は無視

      window.requestAnimationFrame(() => {
        setMenuTop(headerHeight + headerNewsHeight * ratio + menuNetMargin)
        ticking.current = false // リクエストアニメーションフレームが完了したらフラグをリセット
      })

      ticking.current = true // リクエストアニメーションフレームをリクエストしたのでフラグを立てる
    }

    const observer = new IntersectionObserver(adjustMenuTop, options)
    if (el) observer.observe(el)

    return () => {
      if (el) observer.unobserve(el)
    }
  }, [headerHeight, headerNewsHeight, initialMenuTop, isContextMenuOpen, isNewsOpen, menuNetMargin])

  return { positionStyle, newsBarRef }
}

export default useContextMenuTop
