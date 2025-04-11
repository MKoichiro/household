import { createContext, Dispatch, SetStateAction, useContext } from 'react'
import { Transaction, TransactionFormValues } from '../types'
import { User } from 'firebase/auth'

interface AuthContextValue {
  user: User | null
  handleSignup: (email: string, password: string) => () => Promise<void>
  handleLogin: (email: string, password: string) => () => Promise<void>
  handleLogout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  handleSignup: () => async () => {},
  handleLogin: () => async () => {},
  handleLogout: async () => {},
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
