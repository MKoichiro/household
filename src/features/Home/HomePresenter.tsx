import { Box } from '@mui/material'
import {
  MonthlySummary,
  MonthlySummaryProps,
  Calendar,
  CalendarProps,
  TransactionDetail,
  TransactionDetailProps,
  TransactionForm,
  TransactionFormProps,
} from './components'
import styled from '@emotion/styled'
import { transactionMenuWidth } from '../../shared/constants/ui'
import { HomeActions, HomeStates } from '../../pages/HomeContainer'

interface HomePresenterProps {
  states: HomeStates
  actions: HomeActions
}

const HomePresenter = ({ states, actions }: HomePresenterProps) => {
  const { monthlyTransactions, dailyTransactions, isFormOpen, isDetailOpen, selectedTransaction } = states

  const {
    handleDetailClose,
    handleTransactionAddClick,
    handleTransactionCardClick,
    handleEntryCloseClick,
    handleFormSubmit,
    handleTypeClick,
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
    onTypeClick: handleTypeClick,
    onDeleteClick: handleDeleteClick,
    onCloseClick: handleEntryCloseClick,
  }

  return (
    <HomeRoot>
      <Box
        sx={{
          flexGrow: 1,
          padding: { xs: '0.8rem', lg: '1rem' },
          width: { xs: '100%', lg: `calc(100% - ${transactionMenuWidth}px)` },
        }}
      >
        <MonthlySummary {...monthlySummaryProps} />
        <Calendar {...calendarProps} />
      </Box>

      <Box sx={{ display: 'flex', width: { xs: 0, lg: `${transactionMenuWidth}px` } }}>
        <TransactionDetail {...transactionDetailProps} />
        <TransactionForm {...transactionFormProps} />
      </Box>
    </HomeRoot>
  )
}

export default HomePresenter

const HomeRoot = styled.div`
  display: flex;
  overflow: clip;
`
