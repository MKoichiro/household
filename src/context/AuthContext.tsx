// AuthContext.tsx - 認証状態を提供するContext
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { auth } from '../firebase'

interface AuthContextValue {
  user: User | null;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  handleLogin: async () => {},
  handleLogout: async () => {},
})

// 他のコンポーネントで利用するためのカスタムフック
export const useAuth = () => useContext(AuthContext)

// プロバイダコンポーネント
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Firebase Authのユーザー状態を監視し、状態が変わるたびにuserを更新
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // ログイン処理
  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      console.error("ログインに失敗しました:", err);
      // TODO: エラーメッセージの表示など
    }
  }

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth)
      // navigate('/auth/login', { replace: true }) // Loginページへ
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
      // TODO: エラーメッセージの表示など
    }
  }

  const value = {
    user,
    handleLogin,
    handleLogout,
  }

  // ユーザー状態の確認が完了するまでローディング表示
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
