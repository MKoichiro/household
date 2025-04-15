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
  severity: AlertColor
  message: string
  timer?: number // [ms]単位。undefined（or 0 以下）の場合は無制限表示。
}

interface NotificationContextType {
  notification: NotificationType
  setNotification: Dispatch<SetStateAction<NotificationType>>
  handleNotificationClose: () => void
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification: グローバルなデータはプロバイダーの中で取得してください')
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
