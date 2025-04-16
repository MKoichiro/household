import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { Transaction, TransactionFormValues } from '../types'
import { User } from 'firebase/auth'
import { AlertColor } from '@mui/material'

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
}

export const NotificationContext = createContext<NotificationsContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

interface AppContextType {
  currentMonth: Date
  setCurrentMonth: Dispatch<SetStateAction<Date>>
  selectedDay: string
  setSelectedDay: Dispatch<SetStateAction<string>>
  isSideBarOpen: boolean
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>
  isUnderLG: boolean
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}
