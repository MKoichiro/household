import { Transaction } from '../../../../shared/types'
import { headerMainHeight, transactionMenuWidth } from '../../../../shared/constants/ui'
import styled from '@emotion/styled'
import { useLayout } from '../../../../shared/hooks/useContexts'
import TransactionDetailBody from './TransactionDetailBody'
import { useTheme } from '@mui/material'
import { CSSProperties } from 'react'
import * as Header from './TransactionDetailHeaders'
import { HalfModal } from '../../../../components/common/HalfModal/HalfModal'
import { useHalfModal } from '../../../../components/common/HalfModal/useHalfModal'
import { useBreakpoint } from '../../../../shared/hooks/useBreakpoint'

export interface TransactionDetailProps {
  dailyTransactions: Transaction[]
  isOpen: boolean
  onClose: () => void
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
}

const TransactionDetail = (props: TransactionDetailProps) => {
  const { isOpen, onClose: handleClose, ...rest } = props
  const { isNavigationMenuOpen } = useLayout()
  const theme = useTheme()
  const breakpoint = useBreakpoint()
  const isDownLg = breakpoint === 'md' || breakpoint === 'sm' || breakpoint === 'xs'
  const isMd = breakpoint === 'md'

  const {
    register: { style, ...registerRest },
    overflowableRef,
  } = useHalfModal(isOpen, handleClose, theme.zIndex.transactionDetail.md)

  const styleOverride: CSSProperties = {
    ...style,
    left: isNavigationMenuOpen && isMd ? `${theme.width.navigationMenu.md}` : 0,
    backgroundColor: isDownLg
      ? theme.palette.app.lighterBg.level1.bg[theme.palette.mode]
      : theme.palette.app.lighterBg.level2.bg[theme.palette.mode],
    overflowX: 'hidden',
    overflowY: 'auto',
  }

  return (
    <>
      {isDownLg ? (
        // タブレット以下
        <HalfModal isOpen={isOpen} register={{ ...registerRest, style: styleOverride }}>
          <TransactionDetailBody {...rest} header={<Header.Modal onClose={handleClose} />} ref={overflowableRef} />
        </HalfModal>
      ) : (
        // ラップトップ以上
        <StickyContext>
          <DetailLaptop>
            <TransactionDetailBody {...rest} header={<Header.Base />} />
          </DetailLaptop>
        </StickyContext>
      )}
    </>
  )
}

export default TransactionDetail

const StickyContext = styled.div`
  position: relative;
  min-height: calc(100vh - ${headerMainHeight}px);
  background-color: ${({ theme }) => theme.palette.background.paper};
  z-index: ${({ theme }) => theme.zIndex.transactionDetail.lg};
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  background-color: ${({ theme }) => theme.palette.app.lighterBg.level2.bg[theme.palette.mode]};
`

const DetailLaptop = styled.div`
  position: sticky;
  min-width: ${transactionMenuWidth}px;
  max-height: calc(100vh - ${headerMainHeight}px);
  top: ${headerMainHeight}px;
  transition: top 300ms ease;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.transactionDetail.lg};
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`
