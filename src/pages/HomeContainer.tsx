import type { DateClickArg } from '@fullcalendar/interaction'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMediaQuery } from '@mui/material'
import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { useState } from 'react'
import type { ControllerRenderProps, SubmitHandler } from 'react-hook-form'
import { FormProvider, useForm } from 'react-hook-form'

import HomePresenter from '@features/Home/HomePresenter'
import { useApp, useTransaction } from '@shared/hooks/useContexts'
import type { Transaction, TransactionFormValues, TransactionType } from '@shared/types'
import { formatMonth } from '@shared/utils/formatting'
import { transactionSchema } from '@shared/validations/schema'
import { mqp } from '@styles/theme/helpers/mediaqueryPicker'

export interface HomeStates {
  selectedDay: string
  monthlyTransactions: Transaction[]
  dailyTransactions: Transaction[]
  isFormOpen: boolean
  isDetailOpen: boolean
  selectedTransaction: Transaction | null
}

export interface HomeActions {
  setCurrentMonth: Dispatch<SetStateAction<Date>>
  setSelectedDay: Dispatch<SetStateAction<string>>
  handleDetailClose: () => void
  handleTransactionAddClick: () => void
  handleTransactionCardClick: (transaction: Transaction) => () => void
  handleEntryCloseClick: () => void
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void
  handleTypeChange: (type: TransactionType) => () => void
  handleAmountBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
  handleDeleteClick: () => void
  handleDateClick: (dateInfo: DateClickArg) => void
}

const HomeContainer = () => {
  const { currentMonth, setCurrentMonth, selectedDay, setSelectedDay } = useApp()
  const { transactions, handleAddTransaction, handleUpdateTransaction, handleDeleteTransaction } = useTransaction()
  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(formatMonth(currentMonth)))
  const dailyTransactions = monthlyTransactions.filter((transaction) => transaction.date === selectedDay)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const initialFormValues: TransactionFormValues = {
    type: 'expense',
    date: selectedDay,
    amount: '',
    category: '',
    content: '',
  }
  const methods = useForm<TransactionFormValues>({
    defaultValues: initialFormValues,
    resolver: zodResolver(transactionSchema),
  })
  const { handleSubmit, setValue, reset } = methods

  const isDownMd = useMediaQuery(mqp('down', 'md'))
  const [isDetailOpen, setIsDetailOpen] = useState(isDownMd ? false : true)

  /* Helpers */
  const handleDetailOpen = () => setIsDetailOpen(true)
  const clearForm = () => reset(initialFormValues)

  /* Calendar */
  const handleDateClick = (dateInfo: DateClickArg) => {
    setSelectedDay(dateInfo.dateStr)
    setValue('date', dateInfo.dateStr)
    handleDetailOpen()
  }

  /* TransactionDetail */
  const handleDetailClose = () => setIsDetailOpen(false)

  // 内訳追加ボタンのクリック
  const handleTransactionAddClick = () => {
    if (selectedTransaction === null) {
      setIsFormOpen((prev) => !prev)
      return
    }
    setIsFormOpen(true)
    setSelectedTransaction(null)
    clearForm()
  }

  // 内訳カードのクリック
  const handleTransactionCardClick = (transaction: Transaction) => {
    return () => {
      setIsFormOpen(true)

      // 選択transactionでフォームを初期化
      setSelectedTransaction(transaction)
      reset({
        type: transaction.type,
        amount: String(transaction.amount),
        date: transaction.date,
        category: transaction.category,
        content: transaction.content,
      })
    }
  }

  /* TransactionForm */
  // 入力ドロワー/ダイアログの閉じるボタン
  const handleEntryCloseClick = () => {
    setIsFormOpen(false)
    setSelectedTransaction(null)
  }

  // 提出時の処理
  const onSubmit: SubmitHandler<TransactionFormValues> = (data) => {
    if (selectedTransaction) {
      void handleUpdateTransaction(data, selectedTransaction.id)
      reset(data) // resetを呼ぶことでisDirtyによる差分監視の開始ポイントも変更
    } else {
      void handleAddTransaction(data)
      clearForm()
    }
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => void handleSubmit(onSubmit)(e)

  // 収支タイプを切り替える関数
  // type="submit" ではない Buttonは RHF にフォームパーツとして認識されない。
  // そのため、更新処理は onClick を使って手動で行う。
  const handleTypeChange = (type: TransactionType) => {
    return () => {
      // shouldDirty: true で差分と認識させる
      setValue('type', type, { shouldDirty: true })
      setValue('category', '', { shouldDirty: true })
      setValue('amount', '', { shouldDirty: true })
      setValue('content', '', { shouldDirty: true })
    }
  }

  const handleAmountBlur = (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => {
    return () => {
      if (field.value === '0') field.onChange('')

      // カンマ区切り文字列は受け付けられないので今後の課題とする。
      // オーバーレイコンポーネントを用意してそこで表示したりしなくてはいけなくなる。
      field.onBlur()
    }
  }

  const handleDeleteClick = () => {
    if (!selectedTransaction) return
    void handleDeleteTransaction(selectedTransaction.id)
    setSelectedTransaction(null)
    clearForm()
  }

  const states: HomeStates = {
    selectedDay,
    monthlyTransactions,
    dailyTransactions,
    isFormOpen,
    isDetailOpen,
    selectedTransaction,
  }

  const actions: HomeActions = {
    setCurrentMonth,
    setSelectedDay,
    handleDetailClose,
    handleTransactionAddClick,
    handleTransactionCardClick,
    handleEntryCloseClick,
    handleFormSubmit,
    handleTypeChange,
    handleAmountBlur,
    handleDeleteClick,
    handleDateClick,
  }

  return (
    <FormProvider {...methods}>
      <HomePresenter states={states} actions={actions} />
    </FormProvider>
  )
}

export default HomeContainer
