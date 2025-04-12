import { Box } from '@mui/material'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionMenu from '../components/TransactionMenu'
import TransactionForm from '../components/TransactionForm'
import { Transaction, TransactionFormValues, TransactionType } from '../types'
import { useState } from 'react'
import { DateClickArg } from '@fullcalendar/interaction/index.js'
import { ControllerRenderProps, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { formatMonth } from '../utils/formatting'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '../validations/schema'
import { useApp, useNotification, useTransaction } from '../hooks/useContexts'

const Home = () => {
  const { isUnderLG, currentMonth, setCurrentMonth, selectedDay, setSelectedDay } = useApp()

  const { transactions, handleSaveTransaction, handleUpdateTransaction, handleDeleteTransaction } = useTransaction()

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

  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(isUnderLG ? false : true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  // 現在の収益タイプを監視
  const currentType: TransactionType = watch('type')

  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(formatMonth(currentMonth)))
  const dailyTransactions = monthlyTransactions.filter((transaction) => transaction.date === selectedDay)

  // TransactionDrawer のロジック部分
  const handleDetailDrawerOpen = () => {
    if (!isUnderLG) return
    setIsDetailDrawerOpen(true)
  }

  const handleDetailDrawerClose = () => {
    if (!isUnderLG) return
    setIsDetailDrawerOpen(false)
  }

  const handleDateClick = (dateInfo: DateClickArg) => {
    // console.log(dateInfo);
    setSelectedDay(dateInfo.dateStr)
    setValue('date', dateInfo.dateStr)
    handleDetailDrawerOpen()
  }

  // 内訳追加ボタンのクリック
  const handleTransactionAddClick = () => {
    if (isUnderLG) {
      setIsFormModalOpen(true)
      if (selectedTransaction === null) {
        setIsFormModalOpen((prev) => !prev)
        return
      }
    } else {
      if (selectedTransaction === null) {
        setIsEntryDrawerOpen((prev) => !prev)
        return
      }
      setIsEntryDrawerOpen(true)
    }
    setSelectedTransaction(null)
    clearForm()
  }

  // 内訳カードのクリック
  const handleTransactionCardClick = (transaction: Transaction) => {
    return () => {
      if (isUnderLG) {
        setIsFormModalOpen(true)
      } else {
        setIsEntryDrawerOpen(true)
      }

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

  // TransactionForm のロジック部分
  // 入力ダイアログを閉じる処理（DialogのonCloseに登録）
  const handleDialogClose = () => {
    setIsFormModalOpen(false)
  }

  // 入力ドロワー/ダイアログの閉じるボタン
  const handleEntryCloseClick = () => {
    if (isUnderLG) {
      setIsFormModalOpen(false)
    } else {
      setIsEntryDrawerOpen(false)
    }
    setSelectedTransaction(null)
  }

  // 提出時の処理
  const submitHandler: SubmitHandler<TransactionFormValues> = (data) => {
    // console.log(data)
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
      if (field.value === '0') {
        field.onChange('')
      }
      // カンマ区切り文字列は受け付けられないので今後の課題とする。
      // オーバーレイコンポーネントを用意してそこで表示したりしなくてはいけなくなる。
      // else { field.onChange(formatCurrency(field.value)) }
      field.onBlur()
    }
  }

  const handleDeleteClick = () => {
    if (selectedTransaction) {
      handleDeleteTransaction(selectedTransaction.id)
      setSelectedTransaction(null)
      clearForm()
    }
  }

  const clearForm = () => {
    reset(initialFormValues)
  }

  // フラッシュメッセージの表示
  const { Notification } = useNotification()

  return (
    <FormProvider {...methods}>
      {/* ログイン成功後のフラッシュメッセージ表示部分 */}
      <Notification severity="success" />

      <Box sx={{ display: 'flex' }}>
        {/* 左側 */}
        <Box sx={{ flexGrow: 1 }}>
          <MonthlySummary monthlyTransactions={monthlyTransactions} />
          <Calendar
            monthlyTransactions={monthlyTransactions}
            setCurrentMonth={setCurrentMonth}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            onDateClick={handleDateClick}
          />
        </Box>

        {/* 右側 */}
        <Box>
          <TransactionMenu
            selectedDay={selectedDay}
            dailyTransactions={dailyTransactions}
            isUnderLG={isUnderLG}
            isDrawerOpen={isDetailDrawerOpen}
            onDrawerClose={handleDetailDrawerClose}
            onAddClick={handleTransactionAddClick}
            onCardClick={handleTransactionCardClick}
          />
          <TransactionForm
            // states
            selectedTransaction={selectedTransaction}
            isUnderLG={isUnderLG}
            isEntryDrawerOpen={isEntryDrawerOpen}
            isModalOpen={isFormModalOpen}
            // handlers
            onSubmit={handleSubmit(submitHandler)}
            onAmountBlur={handleAmountBlur}
            onTypeClick={handleTypeClick}
            onDeleteClick={handleDeleteClick}
            onCloseClick={handleEntryCloseClick}
            onDialogClose={handleDialogClose}
            // react-hook-form
            formState={formState}
            control={control}
            currentType={currentType}
          />
        </Box>
      </Box>
    </FormProvider>
  )
}

export default Home
