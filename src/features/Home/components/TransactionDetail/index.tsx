import { theme } from '../../../../styles/theme/theme'
import { Transaction } from '../../../../shared/types'
import { navigationMenuWidth, transactionMenuWidth } from '../../../../shared/constants/ui'
import styled from '@emotion/styled'
import { useLayout, usePortal } from '../../../../shared/hooks/useContexts'
import Mask from '../../../../components/common/Mask'
import TransactionDetailBody from './TransactionDetailBody'

export interface TransactionDetailProps {
  selectedDay: string
  dailyTransactions: Transaction[]
  isOpen: boolean
  onClose: () => void
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
}

const TransactionDetail = (props: TransactionDetailProps) => {
  const { isOpen, onClose: handleClose, ...rest } = props
  const portalRenderer = usePortal('half-modal')
  const { isNavigationMenuOpen, dynamicHeaderHeight } = useLayout()

  return (
    <>
      {/* タブレット以下 */}
      {portalRenderer(
        <>
          <Mask id="test-mask" $isOpen={isOpen} $zIndex={theme.zIndex.transactionDetail.md - 1} onClick={handleClose} />
          <DetailTablet id="test-real" $isNavigationMenuOpen={isNavigationMenuOpen} $isOpen={isOpen}>
            <TransactionDetailBody {...rest} />
          </DetailTablet>
        </>
      )}
      {/* ラップトップ以上 */}
      <StickyContext $dynamicHeaderHeight={dynamicHeaderHeight()}>
        <DetailLaptop $dynamicHeaderHeight={dynamicHeaderHeight()}>
          <TransactionDetailBody {...rest} />
        </DetailLaptop>
      </StickyContext>
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
  /* background-color: rgba(255, 0, 255, 0.5); */
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

const DetailTablet = styled.div<{ $isNavigationMenuOpen: boolean; $isOpen: boolean }>`
  /* background-color: rgba(0, 0, 255, 0.4); */
  background-color: ${({ theme }) => theme.palette.background.paper};
  position: fixed;
  top: ${({ $isOpen }) => ($isOpen ? '30vh' : '100vh')};
  left: ${({ $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0')};
  right: 0;
  height: 70lvh;
  z-index: ${({ theme }) => theme.zIndex.transactionDetail.md};
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 0.5rem 1rem;
  transition:
    top 300ms ease,
    left 300ms ease;
  overflow-y: auto;
  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: none;
  }
`
