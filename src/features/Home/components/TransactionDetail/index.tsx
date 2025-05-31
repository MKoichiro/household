import styled from '@emotion/styled'
import { useTheme } from '@mui/material'
import type { CSSProperties } from 'react'

import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { useLayout } from '@shared/hooks/useContexts'
import type { Transaction } from '@shared/types'
import { cp } from '@styles/theme/helpers/colorPickers'
import { HalfModal } from '@ui/HalfModal/HalfModal'
import { useHalfModal } from '@ui/HalfModal/useHalfModal'

import TransactionDetailBody from './TransactionDetailBody'
import * as Header from './TransactionDetailHeaders'

export interface TransactionDetailProps {
  dailyTransactions: Transaction[]
  isOpen: boolean
  onClose: () => void
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
}

const TransactionDetail = (props: TransactionDetailProps) => {
  const { isOpen, onClose: handleClose, ...rest } = props
  const theme = useTheme()
  const { isNavigationMenuOpen } = useLayout()
  const { bp, isDown } = useBreakpoint()
  const isMd = bp === 'md'

  const {
    register: { style, ...registerRest },
    overflowableRef,
  } = useHalfModal(isOpen, handleClose, theme.zIndex.transactionDetail.md)

  const styleOverride: CSSProperties = {
    ...style,
    left: isNavigationMenuOpen && isMd ? theme.width.navigationMenu.md : 0,
    backgroundColor: isDown.md ? cp(theme, 'app.lighterBg.level1.bg') : cp(theme, 'app.lighterBg.level2.bg'),
    overflowX: 'hidden',
    overflowY: 'auto',
  }

  return (
    <>
      {isDown.lg ? (
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

const StickyContext = styled.div`
  /* display: none; */

  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: block;
    position: relative;
    min-height: ${({ theme }) => `calc(100vh - ${theme.height.header.lg})`};
    z-index: ${({ theme }) => theme.zIndex.transactionDetail.lg};
    border-top-left-radius: 0.5rem;
    border-bottom-left-radius: 0.5rem;
    background-color: ${({ theme }) => cp(theme, 'app.lighterBg.level2.bg')};
  }

  ${({ theme }) => theme.breakpoints.up('xl')} {
    min-height: ${({ theme }) => `calc(100vh - ${theme.height.header.xl})`};
    z-index: ${({ theme }) => theme.zIndex.transactionDetail.xl};
  }
`

const DetailLaptop = styled.div`
  /* display: none; */

  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: block;
    position: sticky;
    min-width: ${({ theme }) => theme.width.transactionMenu.xl};
    max-height: calc(100vh - ${({ theme }) => theme.height.header.xl});
    top: ${({ theme }) => theme.height.header.xl};
    transition: top 300ms;
    overflow-y: auto;
    z-index: ${({ theme }) => theme.zIndex.transactionDetail.xl};
  }
  ${({ theme }) => theme.breakpoints.up('xl')} {
    min-width: ${({ theme }) => theme.width.transactionMenu.xl};
    max-height: calc(100vh - ${({ theme }) => theme.height.header.xl});
    top: ${({ theme }) => theme.height.header.xl};
    z-index: ${({ theme }) => theme.zIndex.transactionDetail.xl};
  }
`

export default TransactionDetail
