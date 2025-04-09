// AuthContext.tsx - 認証状態を提供するContext
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'
import { auth } from '../firebase'
import AppProvider from './AppContext';

interface AuthContextValue {
  user: User | null;
  handleSignup: (email: string, password: string) => () => Promise<void>;
  handleLogin: (email: string, password: string) => () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  handleSignup: () => async () => {},
  handleLogin: () => async () => {},
  handleLogout: async () => {},
})



// プロバイダコンポーネント
const AuthProvider = ({ children }: { children: ReactNode }) => {
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

  const handleSignup = (email: string, password: string) => async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("登録失敗:", error)
      // TODO: エラーメッセージの表示など
    }
  }

  const handleLogin = (email: string, password: string) => async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("ログインに失敗しました:", error)
      // TODO: エラーメッセージの表示など
    }
  }

  const handleLogout = async () => {
    try {
      console.log("clicked")
      await signOut(auth)
    } catch (error) {
      console.error('ログアウトに失敗しました:', error)
      // TODO: エラーメッセージの表示など
    }
  }

  const value = {
    user,
    handleSignup,
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

export default AppProvider

// 他のコンポーネントで利用するためのカスタムフック
export const useAuth = () => useContext(AuthContext)
