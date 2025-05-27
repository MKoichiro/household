import type { ReactNode, ReactElement } from 'react'
import { Children, isValidElement } from 'react'

/**
 * ReactNode の子孫を再帰的に走査し、
 * 指定した type 名が含まれているかを boolean で返す。
 * css-in-jsや、muiコンポーネントの場合も考慮されてはいるものの、完全に保証するのは技術敵に困難。
 * そのため、あくまで補助的に利用し、実際の判定は別途フラグを立てるなどして行うこと。
 *
 * @param typeName たとえば 'button' や MyComponent.displayName / MyComponent.name
 * @param node ReactNode（props.children など）
 * @return typeName が含まれている場合は true、そうでない場合は false
 */
export function hasDescendantOf(typeName: string, node: ReactNode): boolean {
  // トップレベルの children を平坦化
  const arr = Children.toArray(node)

  for (const child of arr) {
    if (!isValidElement<{ children?: ReactNode }>(child)) continue

    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    const { type, props } = child as ReactElement<{ children?: ReactNode }, any>

    let name: string | undefined

    if (typeof type === 'string') {
      // HTML タグ名
      name = type
    } else {
      // ■ styled-components / Emotion 対応:
      //    element.type.target に基タグ or ベースコンポーネントが入っている場合が多い
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      const target = type.target
      if (typeof target === 'string' || typeof target === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        name = typeof target === 'string' ? target : target.displayName || target.name
      } else {
        // ■ 通常のコンポーネント名
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        name = type.displayName || type.name || type.render?.displayName || type.render?.name
      }
    }

    if (name === typeName || name === typeName.charAt(0).toUpperCase() + typeName.slice(1).toLowerCase()) {
      return true
    }

    // 子孫を再帰的にチェック
    if (props.children && hasDescendantOf(typeName, props.children)) {
      return true
    }
  }

  return false
}
