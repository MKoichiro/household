import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { Transaction, TransactionFormValues } from "../types";
import { useMediaQuery } from "@mui/material";
import { theme } from "../theme/theme";
import { getFormattedTody, parseIntFromCommaSeparated } from "../utils/formatting";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "./AuthContext";


// Firestoreによるエラーかを判定する型ガード
function isFirestoreError(error: unknown): error is {code: string, message: string} {
  return (typeof error === "object" && error !== null && "code" in error)
}

// catchブロックの共通処理
export const outputErrors = (error: unknown) => {
  if (isFirestoreError(error)) {
    console.error(error)
    console.error(error.message)
    console.error(error.code)
  } else {
    console.error('非Firestore由来のエラー: ', error)
  }
}

interface AppContext {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  currentMonth: Date;
  setCurrentMonth: Dispatch<SetStateAction<Date>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  selectedDay: string;
  setSelectedDay: Dispatch<SetStateAction<string>>;
  isSideBarOpen: boolean;
  setIsSideBarOpen: Dispatch<SetStateAction<boolean>>;
  isUnderLG: boolean;
  handleSaveTransaction: (transaction: TransactionFormValues) => Promise<void>;
  handleDeleteTransaction: (transactionIds: string | readonly string[]) => Promise<void>;
  handleUpdateTransaction: (transaction: TransactionFormValues, transactionId: string) => Promise<void>;
}

const AppContext = createContext<AppContext | undefined>(undefined)

const AppProvider = ({ children }: { children: ReactNode }) => {
  const COLLECTION_NAME = "Transactions"

  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState(getFormattedTody())
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
  const isUnderLG = useMediaQuery(theme.breakpoints.down("lg")) // windowオブジェクトを操作

  // ユーザーの取引一覧をリアルタイム取得
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, COLLECTION_NAME),
      where('uid', '==', user.uid)  // 自分のUIDに一致するドキュメントのみ取得
    );

    // クリーンアップ
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
      setTransactions(data);
    });
    return unsubscribe;
  }, [user])

  // （旧）ユーザーの取引一覧を取得
  // useEffect(() => {
  //   const fetchTransactions = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "Transactions"))
  //       const transactions = querySnapshot.docs.map(doc => {
  //         return {
  //           ...doc.data(),
  //           id: doc.id,
  //         } as Transaction // 型アサーション。自動解決されない時のエラー回避。ただし開発者がマニュアルで確認しなくてはいけない。
  //       })
  //       // console.log(transactions)
  //       setTransactions(transactions)
  //     } catch(error) {
  //       outputErrors(error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   fetchTransactions()
  // }, [])

  // 取引を保存する処理
  const handleSaveTransaction = async (transaction: TransactionFormValues) => {
    try {
      if (!user) {
        // エッジケース？
        // ログインページにリダイレクト？
        throw new Error("ユーザーが認証されていません")
      }

      // Firestore側の更新処理
      const formattedData = {
        ...transaction,
        amount: parseIntFromCommaSeparated(transaction.amount),
        uid: user.uid
      }
      const docRef = await addDoc(collection(db, COLLECTION_NAME), formattedData)
      // console.log("Document written with ID: ", docRef.id)

      // transactionsを更新してフロント側へ即時反映
      const newTransaction = {
        ...formattedData,
        id: docRef.id,
      } as Transaction
      setTransactions(prev => ([...prev, newTransaction ]))
    } catch(error) {
      outputErrors(error)
    }
  }

  // 削除する処理
  const handleDeleteTransaction = async (transactionIds: string | readonly string[]) => {
    try {
      // Firestore側
      const ids = Array.isArray(transactionIds)
        ? transactionIds
        : [transactionIds]
      for (const id of ids) {
        await deleteDoc(doc(db, COLLECTION_NAME, id))
      }

      // フロント側
      const newTransactions = transactions.filter(t => !ids.includes(t.id))
      setTransactions(newTransactions)
    } catch (error) {
      outputErrors(error)
    }
  }

  // 更新する処理
  const handleUpdateTransaction = async (transaction: TransactionFormValues, transactionId: string) => {
    try {
      // Firestore側
      const transactionRef = doc(db, COLLECTION_NAME, transactionId);
      const formattedData = {
        ...transaction,
        amount: parseIntFromCommaSeparated(transaction.amount)
      }
      await updateDoc(transactionRef, formattedData);

      // フロント側
      const newTransactions = transactions.map(t => {
        return (t.id === transactionId)
          ? { ...t, ...formattedData }
          : t
      }) as Transaction[]
      setTransactions(newTransactions)
    } catch (error) {
      outputErrors(error)
    }
  }



  const value = {
    transactions,
    setTransactions,
    currentMonth,
    setCurrentMonth,
    isLoading,
    setIsLoading,
    selectedDay,
    setSelectedDay,
    isSideBarOpen,
    setIsSideBarOpen,
    isUnderLG,
    handleSaveTransaction,
    handleDeleteTransaction,
    handleUpdateTransaction,
  }


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("グローバルなデータはプロバイダーの中で取得してください")
  }
  return context
}
