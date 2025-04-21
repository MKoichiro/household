// TransactionContext.tsx - 取引の状態と操作を提供するContext

import { ReactNode, useEffect, useState } from 'react'
import { Transaction, TransactionFormValues } from '../../shared/types'
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../configs/firebase'
import { parseIntFromCommaSeparated } from '../../shared/utils/formatting'
import { outputDBErrors } from '../../shared/utils/errorHandlings'
import { TransactionContext, useAuth } from '../../shared/hooks/useContexts'

const COLLECTION_NAME = 'Transactions'

const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  // 取引をFirestoreに "保存" する処理
  const handleSaveTransaction = async (transaction: TransactionFormValues) => {
    try {
      const formattedData = {
        ...transaction,
        amount: parseIntFromCommaSeparated(transaction.amount),
        uid: user?.uid,
      }
      await addDoc(collection(db, COLLECTION_NAME), formattedData)
    } catch (error) {
      outputDBErrors(error)
    }
  }

  // 削除
  // CHECK: 常に配列で指定する仕様とすることで簡略化可能？
  const handleDeleteTransaction = async (transactionIds: string | readonly string[]) => {
    try {
      const ids = (Array.isArray(transactionIds) ? transactionIds : [transactionIds]) as string[] | readonly string[]
      for (const id of ids) {
        await deleteDoc(doc(db, COLLECTION_NAME, id))
      }
    } catch (error) {
      outputDBErrors(error)
    }
  }

  // 更新
  const handleUpdateTransaction = async (transaction: TransactionFormValues, transactionId: string) => {
    try {
      const transactionRef = doc(db, COLLECTION_NAME, transactionId)
      const formattedData = {
        ...transaction,
        amount: parseIntFromCommaSeparated(transaction.amount),
      }
      await updateDoc(transactionRef, formattedData)
    } catch (error) {
      outputDBErrors(error)
    }
  }

  const value = {
    transactions,
    setTransactions,
    isLoading,
    setIsLoading,
    handleSaveTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
  }

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>
}

export default TransactionProvider
