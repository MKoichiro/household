import type { AlertColor, PaletteMode } from '@mui/material'
import type { User } from 'firebase/auth'
import type { CSSProperties, Dispatch, ReactNode, ReactPortal, SetStateAction } from 'react'
import { createContext, useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'

import { DEFAULT_ENTRIES } from '@app/providers/PortalProvider/constant'
import type { Transaction, TransactionFormValues } from '@shared/types'

export type ColorMode = PaletteMode | 'os'

interface ColorModeContextValue {
  setMode: (mode: ColorMode) => void
  mode: ColorMode
}

export const ColorModeContext = createContext<ColorModeContextValue>({ setMode: () => {}, mode: 'light' })

export const useColorMode = () => {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

interface AuthContextValue {
  user: User | null
  isLogoutProcessing: boolean
  handleSignup: (email: string, password: string) => Promise<unknown>
  handleLogin: (email: string, password: string) => Promise<unknown>
  handleLogout: () => Promise<unknown>
  handleUpdateDisplayName: (displayName: string) => Promise<unknown>
  handleResendVerificationEmail: () => Promise<unknown>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLogoutProcessing: false,
  handleSignup: async () => {},
  handleLogin: async () => {},
  handleLogout: async () => {},
  handleUpdateDisplayName: async () => {},
  handleResendVerificationEmail: async () => {},
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
  handleAddTransaction: (transaction: TransactionFormValues) => Promise<unknown>
  handleAddTransactions: (transactions: TransactionFormValues[]) => Promise<unknown>
  handleDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<unknown>
  handleUpdateTransaction: (transaction: TransactionFormValues, transactionId: string) => Promise<unknown>
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

export type Notifiers = Record<string, () => void>

interface NotificationsContextType {
  notify: Record<string, Notifiers>
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

interface AppContextType {
  homeMonth: Date
  setHomeMonth: Dispatch<SetStateAction<Date>>
  selectedDay: string
  setSelectedDay: Dispatch<SetStateAction<string>>
}

export const AppContext = createContext<AppContextType | undefined>(undefined)

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

export interface LayoutContextType {
  dynamicHeaderHeight: CSSProperties['height']
  isNavigationMenuOpen: boolean
  isNewsOpen: boolean
  setIsNavigationMenuOpen: Dispatch<SetStateAction<boolean>>
  handleNewsOpen: () => void
  handleNewsClose: () => void
}

export const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

export interface PortalEntry {
  name: string
  dataPortal: string
}

export interface PortalEntriesContextType {
  entries: PortalEntry[]
  addEntries: (newEntries: PortalEntry[]) => void
  removeEntry: (entryName: string) => void
}

export const PortalEntriesContext = createContext<PortalEntriesContextType>({
  entries: DEFAULT_ENTRIES,
  addEntries: () => {},
  removeEntry: () => {},
})

export const usePortalEntries = () => {
  const context = useContext(PortalEntriesContext)
  if (!context) {
    throw new Error('usePortalEntries: グローバルなデータはプロバイダーの中で取得してください')
  }
  return context
}

export const usePortalRegistration = (entries: PortalEntry[]) => {
  const { addEntries, removeEntry } = usePortalEntries()
  useEffect(() => {
    addEntries(entries)
    return () => entries.forEach((entry) => removeEntry(entry.name))
  }, [addEntries, entries, removeEntry])
}

export type PortalElementMap = Record<string, HTMLElement>

export const PortalElementContext = createContext<PortalElementMap | undefined>(undefined)

type PortalRendererType = ((content: ReactNode) => ReactPortal) | (() => null)

export const usePortal = (name: string): PortalRendererType => {
  // フック使用側の呼び出しミスを通知
  if (!PortalElementContext && import.meta.env.DEV) {
    console.error('usePortal: グローバルなデータはプロバイダーの中で取得してください')
    throw new Error('usePortal: グローバルなデータはプロバイダーの中で取得してください')
  }
  const map = useContext(PortalElementContext)
  const mountTarget = map && map[name] // nameに対応する <div> を取得
  if (!mountTarget) {
    if (import.meta.env.DEV) console.warn(`usePortal: ${name} は未登録です。`)
    return () => null
  }

  // 任意のReactNodeを受け取って、Portalを返す関数を返す
  return function PortalRenderer(content: ReactNode) {
    return createPortal(content, mountTarget)
  }
}
