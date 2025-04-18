import { createContext, Dispatch, ReactNode, ReactPortal, SetStateAction, useContext } from 'react'
import { Transaction, TransactionFormValues } from '../types'
import { User } from 'firebase/auth'
import { AlertColor } from '@mui/material'
import { createPortal } from 'react-dom'

interface AuthContextValue {
  user: User | null
  handleSignup: (email: string, password: string) => Promise<void>
  handleLogin: (email: string, password: string) => Promise<void>
  handleLogout: () => Promise<void>
  handleUpdateDisplayName: (displayName: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  handleSignup: async () => {},
  handleLogin: async () => {},
  handleLogout: async () => {},
  handleUpdateDisplayName: async () => {},
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

interface TransactionContextType {
  transactions: Transaction[]
  setTransactions: Dispatch<SetStateAction<Transaction[]>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  handleSaveTransaction: (transaction: TransactionFormValues) => Promise<void>
  handleDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>
  handleUpdateTransaction: (transaction: TransactionFormValues, transactionId: string) => Promise<void>
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

export const useTransaction = () => {
  const context = useContext(TransactionContext)
  if (!context) {
    throw new Error('useTransaction: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

export interface NotificationType {
  id: string
  severity: AlertColor
  message: string
  timer?: number // [ms]単位。undefined（or 0 以下）の場合は無制限表示。
}

interface NotificationsContextType {
  notifications: NotificationType[]
  addNotification: (notification: Omit<NotificationType, 'id'>) => void
  removeNotification: (id: string) => void
  removeAllNotifications: () => void
}

export const NotificationContext = createContext<NotificationsContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

export type PortalMap = Record<string, HTMLElement>

export const PortalContext = createContext<PortalMap | undefined>(undefined)

type PortalRendererType = (content: ReactNode) => ReactPortal

export const usePortal = (name: string): PortalRendererType => {
  // フック使用側の呼び出しミスを通知
  if (!PortalContext) {
    console.error('usePortal: グローバルなデータはプロバイダーの中で取得してください')
    throw new Error('usePortal: グローバルなデータはプロバイダーの中で取得してください')
  }
  const map = useContext(PortalContext)
  const mountTarget = map && map[name] // nameに対応する <div> を取得
  if (!mountTarget) {
    console.error(`usePortal: ${name} は登録されていません。`)
    throw new Error(`usePortal: ${name} は登録されていません。`)
  }

  // 任意のReactNodeを受け取って、Portalを返す関数を返す
  return function PortalRenderer(content: ReactNode) {
    return createPortal(content, mountTarget)
  }
}

interface AppContextType {
  currentMonth: Date
  setCurrentMonth: Dispatch<SetStateAction<Date>>
  selectedDay: string
  setSelectedDay: Dispatch<SetStateAction<string>>
  isNavigationMenuOpen: boolean
  setIsNavigationMenuOpen: Dispatch<SetStateAction<boolean>>
  isDownLaptop: boolean
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}
