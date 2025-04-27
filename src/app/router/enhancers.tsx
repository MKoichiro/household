import { ReactNode, Suspense } from 'react'
import LoadingOverlay from '../../components/common/LoadingOverlay'
import Guard, { GuardType } from './guard'
import { APP_NAME } from '../../shared/constants/app'

interface MetaType {
  title?: { prefix?: string; body?: string; noBody?: boolean }
  // NOTE: その他 meta タグを拡張する場合は追記
}

// エンハンサー
const withMeta = (node: ReactNode, meta?: MetaType): ReactNode => {
  const titleMeta = meta?.title
  if (!titleMeta) return node

  const { prefix = APP_NAME.DISPLAY, body, noBody } = titleMeta
  const title = noBody || !body ? prefix : `${prefix} | ${body}`
  return (
    <>
      <title>{title}</title>
      {node}
    </>
  )
}
const withSuspense = (node: ReactNode): ReactNode => <Suspense fallback={<LoadingOverlay isLoading />}>{node}</Suspense>

const withGuard = (node: ReactNode, guards?: GuardType[]): ReactNode => {
  if (!guards) return node
  // ガードの数だけ入れ子にする
  return guards.reduce((acc, guard) => <Guard name={guard}>{acc}</Guard>, node)
}

// コンポーザー
// Layout用
const createLayout = (node: ReactNode, guards?: GuardType[]): ReactNode => {
  let el = withGuard(node, guards)
  el = withSuspense(el)
  return el
}
// Page用
const createPage = (node: ReactNode, meta?: MetaType): ReactNode => {
  let el = withMeta(node, meta)
  el = withSuspense(el)
  return el
}
// 必要に応じてアンコメント
// 汎用
// const createElement = (
//   Component: ReactNode,
//   options: {
//     meta?: MetaType
//     guards?: GuardType[]
//   }
// ): ReactNode => {
//   let el = withMeta(Component, options.meta)
//   el = withSuspense(el)
//   el = withGuard(el, options.guards)
//   return el
// }

export { withMeta, withSuspense, withGuard, createLayout, createPage }
