import { useTheme } from '@mui/material'
import { ControllerRenderProps } from 'react-hook-form'
import { Transaction, TransactionFormValues, TransactionType } from '../../../../shared/types'
import { FormEvent } from 'react'
import { headerHeight, transactionMenuWidth } from '../../../../shared/constants/ui'
import styled from '@emotion/styled'
import { usePortal } from '../../../../shared/hooks/useContexts'
import Mask from '../../../../components/common/Mask'
import TransactionFormBody from './TransactionFormBody'

export interface TransactionFormProps {
  selectedTransaction: Transaction | null
  isFormOpen: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onAmountBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
  onTypeClick: (type: TransactionType) => () => void
  onDeleteClick: () => void
  onCloseClick: () => void
}

const TransactionForm = (props: TransactionFormProps) => {
  const { isFormOpen, onCloseClick: handleCloseClick } = props
  const portalRenderer = usePortal('modal')
  const theme = useTheme()

  return (
    <>
      {/* タブレット以下 */}
      {portalRenderer(
        <>
          <Mask $isOpen={isFormOpen} $zIndex={theme.zIndex.transactionForm.md - 1} onClick={handleCloseClick} />
          <FormTablet $isFormOpen={isFormOpen}>
            <TransactionFormBody {...props} />
          </FormTablet>
        </>
      )}
      {/* ラップトップ以上 */}
      <StickyContext>
        <FormLaptop $isFormOpen={isFormOpen}>
          <TransactionFormBody {...props} />
        </FormLaptop>
      </StickyContext>
    </>
  )
}

export default TransactionForm

// スタイル
const StickyContext = styled.div`
  position: relative;
  width: ${transactionMenuWidth}px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`

const FormLaptop = styled.div<{ $isFormOpen: boolean }>`
  /* background-color: rgba(255, 0, 0, 0.3); */
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 0.5rem;

  position: sticky;
  top: ${headerHeight}px;
  z-index: ${({ theme }) => theme.zIndex.transactionForm.lg};

  padding: 1rem;
  margin-top: 1rem;

  min-width: ${transactionMenuWidth}px;
  overflow-y: auto;

  pointer-events: ${({ $isFormOpen }) => ($isFormOpen ? 'auto' : 'none')};
  transform: translateX(${({ $isFormOpen }) => (!$isFormOpen ? 0 : `calc(-${2 * transactionMenuWidth}px - 0.5rem)`)});
  transition: transform 0.3s ease-in-out;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`

const FormTablet = styled.div<{ $isFormOpen: boolean }>`
  /* background-color: rgba(0, 255, 0, 0.4); */
  background-color: ${({ theme }) => theme.palette.background.paper};
  border-radius: 0.5rem;

  padding: 0.5rem 1rem;

  /* 画面上下中央配置 */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(${({ $isFormOpen }) => ($isFormOpen ? 1 : 0)});
  transition: transform 0.3s ease;

  width: 90vw;
  max-height: 90vh;
  z-index: ${({ theme }) => theme.zIndex.transactionForm.md};

  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: none;
  }
`
