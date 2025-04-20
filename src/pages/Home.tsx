import { Box, useMediaQuery } from '@mui/material'
import MonthlySummary from '../components/MonthlySummary'
import Calendar from '../components/Calendar'
import TransactionDetail from '../components/TransactionDetail'
import TransactionForm from '../components/TransactionForm'
import { Transaction, TransactionFormValues, TransactionType } from '../types'
import { FormEvent, useState } from 'react'
import { DateClickArg } from '@fullcalendar/interaction/index.js'
import { ControllerRenderProps, FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { formatMonth } from '../utils/formatting'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '../validations/schema'
import { useApp, useTransaction } from '../hooks/useContexts'
import styled from '@emotion/styled'
import { transactionMenuWidth } from '../constants/ui'

const Home = () => {
  const { currentMonth, setCurrentMonth, selectedDay, setSelectedDay } = useApp()
  const { transactions, handleSaveTransaction, handleUpdateTransaction, handleDeleteTransaction } = useTransaction()
  const isDownLaptop = useMediaQuery((theme) => theme.breakpoints.down('lg'))

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
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(isDownLaptop ? false : true)
  // const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  // 現在の収益タイプを監視
  const currentType: TransactionType = watch('type')

  const monthlyTransactions = transactions.filter((t) => t.date.startsWith(formatMonth(currentMonth)))
  const dailyTransactions = monthlyTransactions.filter((transaction) => transaction.date === selectedDay)

  // Transaction のロジック部分
  const handleDetailOpen = () => setIsDetailOpen(true)

  const handleDetailClose = () => setIsDetailOpen(false)

  const handleDateClick = (dateInfo: DateClickArg) => {
    setSelectedDay(dateInfo.dateStr)
    setValue('date', dateInfo.dateStr)
    handleDetailOpen()
  }

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

  // TransactionForm のロジック部分
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

  const clearForm = () => {
    reset(initialFormValues)
  }

  return (
    <FormProvider {...methods}>
      <HomeRoot>
        {/* 左側 */}
        <Box sx={{ flexGrow: 1, padding: { xs: '0.5rem', lg: '1rem' } }}>
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
        <Box sx={{ display: 'flex', width: { xs: 0, lg: `${transactionMenuWidth}px` } }}>
          <TransactionDetail
            selectedDay={selectedDay}
            dailyTransactions={dailyTransactions}
            isDownLaptop={isDownLaptop}
            isOpen={isDetailOpen}
            onClose={handleDetailClose}
            onAddClick={handleTransactionAddClick}
            onCardClick={handleTransactionCardClick}
          />

          <TransactionForm
            // states
            selectedTransaction={selectedTransaction}
            isDownLaptop={isDownLaptop}
            isFormOpen={isFormOpen}
            // handlers
            onSubmit={handleFormSubmit}
            onAmountBlur={handleAmountBlur}
            onTypeClick={handleTypeClick}
            onDeleteClick={handleDeleteClick}
            onCloseClick={handleEntryCloseClick}
            // react-hook-form
            formState={formState}
            control={control}
            currentType={currentType}
          />
        </Box>
      </HomeRoot>
    </FormProvider>
  )
}

export default Home

const HomeRoot = styled.div`
  display: flex;
  overflow: clip;
`
