// accessibility utils

import { KeyboardEvent, MouseEvent } from 'react'

type Handler<E> = (e: MouseEvent<E> | KeyboardEvent<E>) => void

/**
 * onKeyDown イベント生成用ユーティリティ。
 * onClickイベントハンドラを使いまわすと便利。
 */
export const keyEventCreator =
  <E extends HTMLElement>({ enter, escape }: { enter?: Handler<E>; escape?: Handler<E> }) =>
  (e: KeyboardEvent<E>): void => {
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
