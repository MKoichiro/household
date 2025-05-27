// TransactionContext.tsx - 取引の状態と操作を提供するContext

import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { db } from '@app/configs/firebase'
import { TransactionContext, useAuth, useNotifications } from '@shared/hooks/useContexts'
import type { Transaction, TransactionFormValues } from '@shared/types'
import { withErrorHandling } from '@shared/utils/errorHandlings'
import { parseIntFromCommaSeparated } from '@shared/utils/formatting'

const COLLECTION_NAME = 'Transactions'

const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { notify } = useNotifications()

  // 本質的に非同期処理となる部分。
  const asyncCriticals = {
    addTransaction: async (transaction: TransactionFormValues) => {
      const formattedData = {
        ...transaction,
        amount: parseIntFromCommaSeparated(transaction.amount),
        uid: user?.uid,
      }
      await addDoc(collection(db, COLLECTION_NAME), formattedData)
    },
    deleteTransaction: async (transactionIds: string | readonly string[]) => {
      const ids = (Array.isArray(transactionIds) ? transactionIds : [transactionIds]) as string[] | readonly string[]
      for (const id of ids) {
        await deleteDoc(doc(db, COLLECTION_NAME, id))
      }
    },
    updateTransaction: async (transaction: TransactionFormValues, transactionId: string) => {
      const transactionRef = doc(db, COLLECTION_NAME, transactionId)
      const formattedData = {
        ...transaction,
        amount: parseIntFromCommaSeparated(transaction.amount),
      }
      await updateDoc(transactionRef, formattedData)
    },
  }

  // 依存配列に非プリミティブ型を指定する場合、ネストされたプロパティの変化は検知しないので、
  // useEffectの実行条件は初回、ログイン、ログアウトのみ
  // 実効的にはログイン時にsnapshotが取られ、これを監視するイベントリスナのようなものを登録することでリアルタイム取得を実現。
  useEffect(() => {
    if (!user) return

    // クエリ定義: 自分のUIDに一致するドキュメントのみ取得
    const q = query(collection(db, COLLECTION_NAME), where('uid', '==', user.uid))

    // onSnapshot: firestoreに付与するベントリスナのように動く。
    // qで取得したドキュメントのみへの変更を検知するたびに発火。
    // unsubscribeで受けている返り値には、クリーンアップ関数が入る
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Transaction[]
      setTransactions(data)
      setIsLoading(false)
    })

    // クリーンアップ
    return unsubscribe
  }, [user]) // userオブジェクトの参照の変化がトリガー

  const handlers = {
    handleAddTransaction: withErrorHandling(notify.addTransaction, asyncCriticals.addTransaction),
    handleDeleteTransaction: withErrorHandling(notify.deleteTransaction, asyncCriticals.deleteTransaction),
    handleUpdateTransaction: withErrorHandling(notify.updateTransaction, asyncCriticals.updateTransaction),
  }

  const value = {
    transactions,
    setTransactions,
    isLoading,
    setIsLoading,
    ...handlers,
  }

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

export default TransactionProvider
