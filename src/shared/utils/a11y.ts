import type { KeyboardEvent, MouseEvent } from 'react'

type Handler<E> = (e: MouseEvent<E> | KeyboardEvent<E>) => void

/**
 * onKeyDown イベント生成用ユーティリティ。
 * onClickイベントハンドラを使いまわすと便利。
 */
export const keyEventCreator = <E extends HTMLElement>({
  enter,
  escape,
}: {
  enter?: Handler<E>
  escape?: Handler<E>
}) => {
  if (!enter && !escape) {
    if (import.meta.env.DEV) {
      // イテレートなどによる動的割り当ての場合には、undefined の可能性があるため、コンソール出力にとどめる。
      console.warn('keyEventCreator: Both enter and escape handlers are undefined. No action will be taken.')
    }
    return (_e: KeyboardEvent<E>): void => {}
  }

  return (e: KeyboardEvent<E>): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (enter) {
        e.preventDefault()
        enter(e)
      }
    } else if (e.key === 'Escape') {
      if (escape) {
        e.preventDefault()
        escape(e)
      }
    }
  }
}
