// 汎用性の高いアコーディオンコンポーネント
import type { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react'
import { forwardRef } from 'react'

import { keyEventCreator } from '@shared/utils/a11y'

// コンポーネント固有のpropsを引き継ぐための型
type BareAccordionHeadProps<C extends ElementType = 'div'> = {
  component?: C
  open: boolean
} & ComponentPropsWithoutRef<C>

export const BareAccordionHead = <C extends ElementType = 'div'>({
  component,
  open,
  ...rest
}: BareAccordionHeadProps<C>) => {
  const { children, className, tabIndex, onClick, onKeyDown, role, ...restProps } = rest
  const Component = component || 'div'

  return (
    <Component
      role={role ? role : 'button'}
      aria-expanded={open}
      tabIndex={tabIndex ? tabIndex : 0}
      onClick={onClick}
      onKeyDown={onClick ? (!onKeyDown ? keyEventCreator({ enter: onClick }) : onKeyDown) : undefined}
      className={className}
      {...restProps}
    >
      {children}
    </Component>
  )
}

export const BareAccordionContent = forwardRef<HTMLDivElement, { children: ReactNode; className?: string }>(
  ({ children, className }, ref) => {
    // margin collapsing を防ぐための手段
    // つまり、子要素の高さ方向のマージンをdiv内に収めるための指定
    // future: オプショナル引数で受け取ることも今後検討する
    const strategy = {
      overflow: { overflow: 'hidden' },
      // padding: { paddingTop: '1px' },
      // border: { borderTop: '1px transparent' },
      // display: { display: 'flow-root' },
    }

    // 実際に高さを変える要素と、高さを取得する要素を分けることで、contentHeightの初期値が0でも高さを取得できる
    return (
      <>
        {/* 高さを変える要素 */}
        <div className={className}>
          {/* 高さを取得するための要素 */}
          <div ref={ref} style={strategy.overflow}>
            {children}
          </div>
        </div>
      </>
    )
  }
)
// forwardRefを使用する場合、主にデバッグツールで使われるdisplayNameが推論されないため、手動で設定する
BareAccordionContent.displayName = 'BareAccordionContent'
