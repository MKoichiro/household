// リダイレクト処理を行うコンポーネントで、リダイレクト処理時にaddNotificationでメッセージをセット。
// NotificationコンポーネントをBrowserRouterの外に配置することで、ページ遷移に影響されず通知を表示することができる。

import type { ReactNode } from 'react'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import type { NotificationType } from '@shared/hooks/useContexts'
import { NotificationContext } from '@shared/hooks/useContexts'

type NotifyActionType =
  | 'login'
  | 'signup'
  | 'verifyEmail'
  | 'logout'
  | 'updateDisplayName'
  | 'addTransaction'
  | 'deleteTransaction'
  | 'updateTransaction'
  | 'getNews'

type NotifyMapType = {
  [K in NotifyActionType]: {
    ok?: Omit<NotificationType, 'id'>
    ng?: Omit<NotificationType, 'id'>
  }
}

// NOTE: インデックスシグネチャで定義しているため、現状"notify."後のエディタによるメソッド補完が効かない
type NotifyType = {
  [K in NotifyActionType]: {
    ok?: () => void
    ng?: () => void
  }
}

const notifyMap: NotifyMapType = {
  // Authentication
  login: {
    ok: {
      severity: 'success',
      message: 'ログインしました！',
      timer: 6000,
    },
    ng: {
      severity: 'error',
      message: 'ログインに失敗しました。再度お試しください。',
    },
  },
  signup: {
    ok: {
      severity: 'warning',
      message: 'まだ完了していません。ご入力いただいたメールアドレス宛てに確認メールを送信しました。ご確認ください。',
    },
    ng: {
      severity: 'error',
      message: 'アカウント作成に失敗しました。再度お試しください。',
    },
  },
  verifyEmail: {
    ok: {
      severity: 'info',
      message: '確認メールを再送信しました。メールをご確認ください。',
    },
    ng: {
      severity: 'error',
      message: '確認メールの再送信に失敗しました。時間をおいて再度お試しください。',
    },
  },
  logout: {
    ok: {
      severity: 'info',
      message: 'ログアウトしました！',
      timer: 6000,
    },
    ng: {
      severity: 'error',
      message: 'ログアウトに失敗しました。再度お試しください。',
    },
  },
  updateDisplayName: {
    ok: {
      severity: 'success',
      message: 'ユーザー名を変更しました！',
      timer: 6000,
    },
    ng: {
      severity: 'error',
      message: 'ユーザー名の変更に失敗しました。再度お試しください。',
    },
  },

  // Transaction
  addTransaction: {
    ok: {
      severity: 'success',
      message: '取引を追加しました！',
      timer: 6000,
    },
    ng: {
      severity: 'error',
      message: '取引の追加に失敗しました。再度お試しください。',
    },
  },
  deleteTransaction: {
    ok: {
      severity: 'success',
      message: '取引を削除しました！',
      timer: 6000,
    },
    ng: {
      severity: 'error',
      message: '取引の削除に失敗しました。再度お試しください。',
    },
  },
  updateTransaction: {
    ok: {
      severity: 'success',
      message: '取引を更新しました！',
      timer: 6000,
    },
    ng: {
      severity: 'error',
      message: '取引の更新に失敗しました。再度お試しください。',
    },
  },

  // news
  getNews: {
    ng: {
      severity: 'warning',
      message: 'お知らせの取得に失敗しています。',
      timer: 10000,
    },
  },
}

const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([])

  const addNotification = (notification: Omit<NotificationType, 'id'> | undefined) => {
    if (!notification) return
    const newNotification: NotificationType = {
      ...notification,
      id: (uuidv4 as () => string)(),
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const removeAllNotifications = () => {
    setNotifications([])
  }

  // ['login', 'signup', ...]をイテレート
  // { login: { ok: () => addNotification(args), ng: () => {} }, ... } を返却
  const notify = (Object.keys(notifyMap) as Array<NotifyActionType>).reduce<NotifyType>((acc, key) => {
    acc[key] = {
      ok: () => addNotification(notifyMap[key].ok),
      ng: () => addNotification(notifyMap[key].ng),
    }
    return acc
  }, {} as NotifyType)

  const value = {
    notify,
    notifications,
    addNotification,
    removeNotification,
    removeAllNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export default NotificationProvider
