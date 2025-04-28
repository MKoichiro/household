// NOTE: loaderでもGuardと同等の機能を実現可能。
// loaderでfirebaseからuserオブジェクトを取得し、認証リダイレクトを実装することも可能だが、
// AuthProviderと重複してuserオブジェクトを取得する通信が発生する。
// Guardは自前で実装し、そこでAuthProviderからuser情報を取得するのが良い。

import { ReactNode } from 'react'
import { useAuth } from '../../shared/hooks/useContexts'
import { Navigate } from 'react-router-dom'

interface GuardConfig {
  predicate: (user: ReturnType<typeof useAuth>['user']) => boolean
  redirectTo: string
}

export type GuardType = 'CheckAuth' | 'RequireAuth' | 'RequireEmailVerification' | 'CheckDev'

type GuardConfigType = Record<GuardType, GuardConfig>

const guardConfig: GuardConfigType = {
  // すでに認証済みなら /app/home へ
  CheckAuth: {
    predicate: (user) => Boolean(user && user.emailVerified),
    redirectTo: '/app/home',
  },
  // 非ログインなら /auth/login へ
  RequireAuth: {
    predicate: (user) => !user,
    redirectTo: '/auth/login',
  },
  // メール未検証なら /verify-email へ
  RequireEmailVerification: {
    predicate: (user) => Boolean(user && !user.emailVerified),
    redirectTo: '/verify-email',
  },
  // 本番なら404へ
  CheckDev: {
    predicate: () => import.meta.env.MODE !== 'development',
    redirectTo: '/404',
  },
}

interface GuardProps {
  name: keyof typeof guardConfig
  children: ReactNode
}

const Guard = ({ name, children }: GuardProps) => {
  const { user } = useAuth()
  const { predicate, redirectTo } = guardConfig[name]

  // ガードのpredicateを実行し、条件を取得
  // 条件を満たさなければリダイレクト、満たせば children を表示
  return predicate(user) ? <Navigate to={redirectTo} replace /> : <>{children}</>
}

export default Guard
