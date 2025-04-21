// AuthContext.tsx - 認証状態を提供するContext

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
import { outputDBErrors } from '../../shared/utils/errorHandlings'
import LoadingOverlay from '../../components/common/LoadingOverlay'
import { AuthContext } from '../../shared/hooks/useContexts'

// プロバイダコンポーネント
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Firebase Authのユーザー状態を監視し、状態が変わるたびにuserを更新
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // const handleSignup = async (email: string, password: string) => {
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password)
  //   } catch (error) {
  //     outputDBErrors(error)
  //   }
  // }
  const handleSignup = async (email: string, password: string) => {
    try {
      // アカウント作成
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      // 作成したユーザーに対して確認メールを送信
      await sendEmailVerification(userCredential.user)
    } catch (error) {
      outputDBErrors(error)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      outputDBErrors(error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      outputDBErrors(error)
    }
  }

  const handleUpdateDisplayName = async (displayName: string) => {
    if (user) {
      try {
        await updateProfile(user, { displayName })
      } catch (error) {
        outputDBErrors(error)
      }
    }
  }

  const value = {
    user,
    handleSignup,
    handleLogin,
    handleLogout,
    handleUpdateDisplayName,
  }

  // ユーザー状態の確認が完了するまでローディング表示
  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
