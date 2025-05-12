import { RefObject, useEffect } from 'react'

type Falsy = false | null | undefined
type ClickAwayTarget = RefObject<HTMLElement | null> | (() => HTMLElement | Falsy) | HTMLElement | Falsy
type EventElement = Document | Window | HTMLElement | RefObject<HTMLElement | null> | (() => HTMLElement | null)

const isRefObject = (target: ClickAwayTarget | EventElement): target is RefObject<HTMLElement | null> => {
  return target !== null && typeof target === 'object' && 'current' in target
}
const isHTMLElement = (target: ClickAwayTarget | EventElement): target is HTMLElement => {
  return target instanceof HTMLElement
}
const isFunction = (target: ClickAwayTarget | EventElement): target is () => HTMLElement | null => {
  return typeof target === 'function'
}

const targetGuard = (target: ClickAwayTarget): HTMLElement | null => {
  if (isRefObject(target)) {
    console.log('isRefObject', target)
    return target.current
  } else if (isHTMLElement(target)) {
    return target
  } else if (isFunction(target)) {
    return target()
  }
  console.warn('targetGuard: target is not valid', target)
  return null
}

/**
 * document (デフォルト)のクリックで 第二引数の callback を実行。ただし、第一引数で指定した要素の中でクリックされた場合は無視する。
 * @param targets - クリックを無視する要素の配列。RefObject、HTMLElement、またはそれらを返す関数を指定できる。
 * @param callback - クリックされたときに実行するコールバック関数
 * @param options - オプション。skipCondition (クリックを無視する条件)、eventElement (イベントを発火させる要素)、dependencies (useEffect の依存配列)
 */
export const useClickAway = (
  targets: ClickAwayTarget[],
  callback: () => void,
  options?: {
    skipCondition?: boolean
    eventElement?: EventElement
    dependencies?: unknown[]
  }
) => {
  useEffect(() => {
    const { skipCondition = false, eventElement = document } = options || {}
    if (skipCondition) return
    const handleClickAway = (e: MouseEvent) => {
      // 存在している要素だけを「内部クリック」とみなす
      const clickedInside = targets.some((t) => {
        const el = targetGuard(t)
        // null/undefined は false。contains が true の要素だけ「内部」
        return !!el && el.contains(e.target as Node)
      })
      if (!clickedInside) callback()
    }

    if (isRefObject(eventElement)) {
      eventElement.current?.addEventListener('mousedown', handleClickAway)
    } else if (isFunction(eventElement)) {
      const el = eventElement()
      if (el) el.addEventListener('mousedown', handleClickAway)
    } else if (isHTMLElement(eventElement)) {
      eventElement.addEventListener('mousedown', handleClickAway)
    } else {
      document.addEventListener('mousedown', handleClickAway)
    }

    return () => {
      if (isRefObject(eventElement)) {
        eventElement.current?.removeEventListener('mousedown', handleClickAway)
      } else if (isFunction(eventElement)) {
        const el = eventElement()
        if (el) el.removeEventListener('mousedown', handleClickAway)
      } else if (isHTMLElement(eventElement)) {
        eventElement.removeEventListener('mousedown', handleClickAway)
      } else {
        document.removeEventListener('mousedown', handleClickAway)
      }
    }
  }, [targets, callback, options])
}
