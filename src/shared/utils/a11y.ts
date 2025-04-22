// accessibility utils

import { KeyboardEvent, MouseEvent } from 'react'

// onClickハンドラをonKeyDownに追加することで、キー操作で発火するハンドラを作るユーティリティ
export const clickableWithKey =
  <E extends HTMLElement>(handler: (e: MouseEvent<E> | KeyboardEvent<E>) => void) =>
  (e: React.KeyboardEvent<E>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handler(e)
    }
  }
