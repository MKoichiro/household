import { useMediaQuery } from '@mui/material'
import { Transaction, TransactionFormValues, TransactionType } from '../shared/types'
import { Dispatch, FormEvent, SetStateAction, useState } from 'react'
import { DateClickArg } from '@fullcalendar/interaction/index.js'
import { Control, ControllerRenderProps, FormProvider, FormState, SubmitHandler, useForm } from 'react-hook-form'
import { formatMonth } from '../shared/utils/formatting'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '../shared/validations/schema'
import { useApp, useTransaction } from '../shared/hooks/useContexts'
import HomePresenter from '../../trash/HomePresenter'

export interface HomeStates {
  selectedDay: string
  monthlyTransactions: Transaction[]
  dailyTransactions: Transaction[]
  isFormOpen: boolean
  isDetailOpen: boolean
  selectedTransaction: Transaction | null
  currentType: TransactionType
  formState: FormState<TransactionFormValues>
  control: Control<TransactionFormValues, object, TransactionFormValues>
}

export interface HomeActions {
  setCurrentMonth: Dispatch<SetStateAction<Date>>
  setSelectedDay: Dispatch<SetStateAction<string>>
  handleDetailClose: () => void
  handleTransactionAddClick: () => void
  handleTransactionCardClick: (transaction: Transaction) => () => void
  handleEntryCloseClick: () => void
  handleFormSubmit: (e: FormEvent<HTMLFormElement>) => void
  handleTypeClick: (type: TransactionType) => () => void
  handleAmountBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
  handleDeleteClick: () => void
  handleDateClick: (dateInfo: DateClickArg) => void
}

const HomeContainer = () => {
  const { currentMonth, setCurrentMonth, selectedDay, setSelectedDay } = useApp()
  const { transactions, handleSaveTransaction, handleUpdateTransaction, handleDeleteTransaction } = useTransaction()
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
  const { formState, handleSubmit, control, setValue, watch, reset } = methods
  const currentType: TransactionType = watch('type') // 現在の収益タイプを監視

  const isDownLaptop = useMediaQuery((theme) => theme.breakpoints.down('lg'))
  const [isDetailOpen, setIsDetailOpen] = useState(isDownLaptop ? false : true)

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
      handleUpdateTransaction(data, selectedTransaction.id)
        .then(() => {
          reset(data) // resetを呼ぶことでisDirtyによる差分監視の開始ポイントも変更
        })
        .catch((error) => {
          console.error(error)
        })
    } else {
      handleSaveTransaction(data)
        .then(() => {
          clearForm()
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => void handleSubmit(onSubmit)(e)

  // 収支タイプを切り替える関数
  // type="submit"ではないButtonはreact-hook-formにフォームパーツとして認識されない。
  // そのため、更新処理はonClickを使って手動で行う。
  const handleTypeClick = (type: TransactionType) => {
    return () => {
      // shouldDirty: trueで差分と認識させる
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
    handleDeleteTransaction(selectedTransaction.id)
      .then(() => {
        setSelectedTransaction(null)
        clearForm()
        // フラッシュメッセージの表示など
      })
      .catch((error) => {
        console.error('削除に失敗しました:', error)
        // フラッシュメッセージの表示など
      })
  }

  const states: HomeStates = {
    selectedDay,
    monthlyTransactions,
    dailyTransactions,
    isFormOpen,
    isDetailOpen,
    selectedTransaction,
    currentType,
    formState,
    control,
  }

  const actions: HomeActions = {
    setCurrentMonth,
    setSelectedDay,
    handleDetailClose,
    handleTransactionAddClick,
    handleTransactionCardClick,
    handleEntryCloseClick,
    handleFormSubmit,
    handleTypeClick,
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
