import { Transaction } from '../../../../shared/types'
import { navigationMenuWidth, transactionMenuWidth } from '../../../../shared/constants/ui'
import styled from '@emotion/styled'
import { useLayout } from '../../../../shared/hooks/useContexts'
import TransactionDetailBody from './TransactionDetailBody'
import { useMediaQuery, useTheme } from '@mui/material'
import { CSSProperties } from 'react'
import * as Header from './TransactionDetailHeaders'
import { HalfModal } from '../../../../components/common/HalfModal/HalfModal'
import { useHalfModal } from '../../../../components/common/HalfModal/useHalfModal'

export interface TransactionDetailProps {
  dailyTransactions: Transaction[]
  isOpen: boolean
  onClose: () => void
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
}

const TransactionDetail = (props: TransactionDetailProps) => {
  const { isOpen, onClose: handleClose, ...rest } = props
  const { isNavigationMenuOpen, dynamicHeaderHeight } = useLayout()
  const theme = useTheme()
  const isUnderLg = useMediaQuery(theme.breakpoints.down('lg'))

  const {
    register: { style, ...registerRest },
    overflowableRef,
  } = useHalfModal(isOpen, handleClose, theme.zIndex.transactionDetail.md)

  const styleOverride: CSSProperties = {
    ...style,
    left: isNavigationMenuOpen ? `${navigationMenuWidth}px` : 0,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    overflowY: 'auto',
  }

  return (
    <>
      {isUnderLg ? (
        // タブレット以下
        <HalfModal isOpen={isOpen} register={{ ...registerRest, style: styleOverride }}>
          <TransactionDetailBody {...rest} header={<Header.Modal onClose={handleClose} />} ref={overflowableRef} />
        </HalfModal>
      ) : (
        // ラップトップ以上
        <StickyContext $dynamicHeaderHeight={dynamicHeaderHeight()}>
          <DetailLaptop $dynamicHeaderHeight={dynamicHeaderHeight()}>
            <TransactionDetailBody {...rest} header={<Header.Base />} />
          </DetailLaptop>
        </StickyContext>
      )}
    </>
  )
}

export default TransactionDetail

const StickyContext = styled.div<{ $dynamicHeaderHeight: number }>`
  position: relative;
  min-height: ${({ $dynamicHeaderHeight }) => `calc(100vh - ${$dynamicHeaderHeight}px)`};
  background-color: ${({ theme }) => theme.palette.background.paper};
  z-index: ${({ theme }) => theme.zIndex.transactionDetail.lg};
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
`

const DetailLaptop = styled.div<{ $dynamicHeaderHeight: number }>`
  position: sticky;
  min-width: ${transactionMenuWidth}px;
  max-height: ${({ $dynamicHeaderHeight }) => `calc(100vh - ${$dynamicHeaderHeight}px)`};
  top: ${({ $dynamicHeaderHeight }) => `${$dynamicHeaderHeight}px`};
  transition: top 300ms ease;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.transactionDetail.lg};
  padding: 1rem;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`
