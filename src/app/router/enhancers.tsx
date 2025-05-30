import type { ComponentType, ReactNode } from 'react'
import { Suspense } from 'react'

import { APP_NAME } from '@shared/constants/app'
import LoadingOverlay from '@ui/LoadingOverlay'

import type { GuardType } from './guard'
import Guard from './guard'

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

// ← 追加: 任意のプロバイダーで包装
type ProviderComponent = ComponentType<{ children: React.ReactNode }>
const withProvider = (node: ReactNode, providers?: ProviderComponent[]): ReactNode => {
  if (!providers || providers.length === 0) return node
  return providers.reduce((acc, Provider) => <Provider>{acc}</Provider>, node)
}

// コンポーザー
// Layout用
const createLayout = (
  node: ReactNode,
  options?: { guards?: GuardType[]; providers?: ProviderComponent[] }
): ReactNode => {
  let el = withProvider(node, options?.providers)
  el = withGuard(el, options?.guards)
  el = withSuspense(el)
  return el
}
// Page用
const createPage = (node: ReactNode, options?: { meta?: MetaType; providers?: ProviderComponent[] }): ReactNode => {
  let el = withProvider(node, options?.providers)
  el = withMeta(el, options?.meta)
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
