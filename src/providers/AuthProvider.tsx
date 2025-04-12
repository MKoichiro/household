// AuthContext.tsx - 認証状態を提供するContext

import { ReactNode, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import { auth } from '../firebase'
import { outputDBErrors } from '../utils/errorHandlings'
import LoadingOverlay from '../components/common/LoadingOverlay'
import { AuthContext } from '../hooks/useContexts'

// プロバイダコンポーネント
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Firebase Authのユーザー状態を監視し、状態が変わるたびにuserを更新
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleSignup = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
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

  const value = {
    user,
    handleSignup,
    handleLogin,
    handleLogout,
  }

  // ユーザー状態の確認が完了するまでローディング表示
  if (isLoading) {
    return <LoadingOverlay isLoading={isLoading} />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
