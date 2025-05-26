import { useTheme } from '@mui/material'
import { ControllerRenderProps } from 'react-hook-form'
import { Transaction, TransactionFormValues, TransactionType } from '../../../../shared/types'
import { FormEvent } from 'react'
import styled from '@emotion/styled'
import { useLayout, usePortal } from '../../../../shared/hooks/useContexts'
import Backdrop from '../../../../components/common/Backdrop'
import TransactionFormBody from './TransactionFormBody'
import { cp } from '../../../../styles/theme/helpers/colorPickers'
import { useModalScrollLock } from '../../../../shared/hooks/useModalScrollLock'

export interface TransactionFormProps {
  selectedTransaction: Transaction | null
  isFormOpen: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onAmountBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
  onTypeChange: (type: TransactionType) => () => void
  onDeleteClick: () => void
  onCloseClick: () => void
}

const TransactionForm = (props: TransactionFormProps) => {
  const { isFormOpen, onCloseClick: handleCloseClick } = props
  const portalRenderer = usePortal('modal')
  const theme = useTheme()
  const { isNavigationMenuOpen } = useLayout()
  const { setOverflowableRef: overflowableRef, setModalBackdropRef: modalBackdropRef } = useModalScrollLock(isFormOpen)

  return (
    <>
      {/* タブレット以下 */}
      {portalRenderer(
        <>
          <Backdrop
            ref={modalBackdropRef}
            $open={isFormOpen}
            $zIndex={theme.zIndex.transactionForm.md - 1}
            onClick={handleCloseClick}
          />
          <FormTablet ref={overflowableRef} $isFormOpen={isFormOpen} $isNavigationMenuOpen={isNavigationMenuOpen}>
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

// スタイル
const StickyContext = styled.div`
  display: none;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: block;
    position: relative;
    width: ${({ theme }) => theme.width.transactionMenu.lg};
    margin-top: 1rem;
  }
  ${({ theme }) => theme.breakpoints.up('xl')} {
    width: ${({ theme }) => theme.width.transactionMenu.xl};
  }
`

const FormLaptop = styled.div<{ $isFormOpen: boolean }>`
  /* デフォルトは非表示 */
  display: none;

  /* lg以上で表示 */
  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: block;
    background-color: ${({ theme }) => cp(theme, 'app.lighterBg.level2.bg')};
    border-radius: 0.5rem;
    position: sticky;
    top: calc(${({ theme }) => theme.height.header.lg} + 1rem);
    z-index: ${({ theme }) => theme.zIndex.transactionForm.lg};
    padding: 0.5rem 1rem 1rem;
    min-width: ${({ theme }) => theme.width.transactionMenu.lg};
    overflow-y: auto;
    pointer-events: ${({ $isFormOpen }) => ($isFormOpen ? 'auto' : 'none')};
    transform: translateX(
      ${({ theme, $isFormOpen }) => (!$isFormOpen ? 0 : `calc(-2 * ${theme.width.transactionMenu.lg} - 1rem)`)}
    );
    transition-duration: 300ms;
    transition: top, transform;
    box-shadow: ${({ theme }) => theme.shadows[4]};
  }

  /* xl以上で設定をxl用に上書き */
  ${({ theme }) => theme.breakpoints.up('xl')} {
    top: calc(${({ theme }) => theme.height.header.xl} + 1rem);
    z-index: ${({ theme }) => theme.zIndex.transactionForm.xl};
    min-width: ${({ theme }) => theme.width.transactionMenu.xl};
    transform: translateX(
      ${({ theme, $isFormOpen }) => (!$isFormOpen ? 0 : `calc(-2 * ${theme.width.transactionMenu.xl} - 1rem)`)}
    );
  }
`

const FormTablet = styled.div<{ $isFormOpen: boolean; $isNavigationMenuOpen: boolean }>`
  background-color: ${({ theme }) => theme.palette.background.paper};
  opacity: ${({ $isFormOpen }) => ($isFormOpen ? 1 : 0)};
  border-radius: 1rem;
  padding: 0.5rem 1rem 1rem;

  /* 画面上下中央配置 */
  position: fixed;
  top: 50%;
  left: 50%;
  right: 0;
  transform: translate(-50%, -50%) scale(${({ $isFormOpen }) => ($isFormOpen ? 1 : 0)});
  transition-duration: 300ms;
  transition: transform, opacity;

  min-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.transactionForm.xs};

  /* スクロールチェーン防止 */
  overscroll-behavior: none;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    z-index: ${({ theme }) => theme.zIndex.transactionForm.sm};
  }
  ${({ theme }) => theme.breakpoints.up('md')} {
    min-width: auto;
    transform: translateX(
        ${({ $isNavigationMenuOpen, theme }) =>
          $isNavigationMenuOpen ? `calc(-50% + ${theme.width.navigationMenu.md} / 2)` : '-50%'}
      )
      translateY(-50%) scale(${({ $isFormOpen }) => ($isFormOpen ? 1 : 0)});
    z-index: ${({ theme }) => theme.zIndex.transactionForm.md};
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: none;
  }
`

export default TransactionForm
