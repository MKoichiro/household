import styled from '@emotion/styled'
import { Box } from '@mui/material'

import type { HomeActions, HomeStates } from '@pages/app/Home'
import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { pagePadding } from '@styles/constants'

import type { MonthlySummaryProps, CalendarProps, TransactionDetailProps, TransactionFormProps } from './components'
import { MonthlySummary, Calendar, TransactionDetail, TransactionForm } from './components'
import BulkInsert from './components/BulkInsert'

interface HomePresenterProps {
  states: HomeStates
  actions: HomeActions
}

const HomePresenter = ({ states, actions }: HomePresenterProps) => {
  const { monthlyTransactions, dailyTransactions, isFormOpen, isDetailOpen, selectedTransaction } = states
  const { bp } = useBreakpoint()
  const {
    handleDetailClose,
    handleTransactionAddClick,
    handleTransactionCardClick,
    handleEntryCloseClick,
    handleFormSubmit,
    handleTypeChange,
    handleAmountBlur,
    handleDeleteClick,
    handleDateClick,
  } = actions

  const monthlySummaryProps: MonthlySummaryProps = {
    monthlyTransactions,
  }

  const calendarProps: CalendarProps = {
    monthlyTransactions,
    onDateClick: handleDateClick,
  }

  const transactionDetailProps: TransactionDetailProps = {
    dailyTransactions,
    isOpen: isDetailOpen,
    onClose: handleDetailClose,
    onAddClick: handleTransactionAddClick,
    onCardClick: handleTransactionCardClick,
  }
  const transactionFormProps: TransactionFormProps = {
    selectedTransaction,
    isFormOpen,
    onSubmit: handleFormSubmit,
    onAmountBlur: handleAmountBlur,
    onTypeChange: handleTypeChange,
    onDeleteClick: handleDeleteClick,
    onCloseClick: handleEntryCloseClick,
  }

  return (
    <HomeRoot>
      <Box
        component="section"
        sx={{
          flexGrow: 1,
          width: (theme) => `calc(100% - ${theme.width.transactionMenu[bp]})`,
          p: pagePadding,
        }}
      >
        <MonthlySummary {...monthlySummaryProps} />
        <Calendar {...calendarProps} />
        <BulkInsert />
      </Box>

      <Box component="aside" sx={{ display: 'flex', width: (theme) => theme.width.transactionMenu[bp] }}>
        <TransactionDetail {...transactionDetailProps} />
        <TransactionForm {...transactionFormProps} />
      </Box>
    </HomeRoot>
  )
}

const HomeRoot = styled.div`
  display: flex;
  overflow: clip;
`

export default HomePresenter
