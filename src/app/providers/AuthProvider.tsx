// AuthContext.tsx - 認証状態を提供するContext

// Authでのuser関係の操作は操作後にリダイレクトする前提なので、
// 個別の「非同期処理中...」を示すステートは個別は不要。
// そのためreduxは使用せず、context APIにとどめる。

import { ReactNode, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'
import { auth } from '../configs/firebase'
import { withErrorHandling } from '../../shared/utils/errorHandlings'
import LoadingOverlay from '../../components/common/LoadingOverlay'
import { AuthContext, useNotifications } from '../../shared/hooks/useContexts'

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { notify } = useNotifications()

  // Firebase Authのユーザー状態を監視し、状態が変わるたびにuserを更新
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // try文に組み込まれる部分。本質的に非同期処理となる部分を含む。
  const asyncCriticals = {
    signup: async (email: string, password: string) => {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password) // アカウント作成
      await sendEmailVerification(userCredential.user) // 作成したユーザーに対して確認メールを送信
    },
    login: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    logout: async () => {
      await signOut(auth)
    },
    updateDisplayName: async (displayName: string) => {
      if (user) {
        await updateProfile(user, { displayName })
      }
    },
    resendVerificationEmail: async () => {
      if (user) {
        await sendEmailVerification(user)
      }
    },
  }

  // 様子をみてメモ化
  const handlers = {
    handleSignup: withErrorHandling(notify.signup, asyncCriticals.signup),
    handleLogin: withErrorHandling(notify.login, asyncCriticals.login),
    handleLogout: withErrorHandling(notify.logout, asyncCriticals.logout),
    handleUpdateDisplayName: withErrorHandling(notify.updateDisplayName, asyncCriticals.updateDisplayName),
    handleResendVerificationEmail: withErrorHandling(notify.verifyEmail, asyncCriticals.resendVerificationEmail),
  }

  const value = {
    user,
    ...handlers,
  }

  // ユーザー状態の確認が完了するまでローディング表示
  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
