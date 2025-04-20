import { Box, Button, Card, CardActionArea, CardContent, Grid, List, ListItem, Stack, Typography } from '@mui/material'
import { Notes, AddCircle } from '@mui/icons-material'
import { theme } from '../theme/theme'
import DailySummary from './DailySummary'
import { Transaction } from '../types'
import { formatCurrency } from '../utils/formatting'
import IconComponents from './common/IconComponents'
import { headerHeight, navigationMenuWidth, transactionMenuWidth } from '../constants/ui'
import styled from '@emotion/styled'
import { usePortal } from '../hooks/useContexts'
import { useApp } from '../hooks/useContexts'
import Mask from './common/Mask'

const StickyContext = styled.div`
  position: relative;
  min-height: calc(100vh - ${headerHeight}px);
  background-color: ${({ theme }) => theme.palette.background.paper};
  z-index: ${({ theme }) => theme.zIndex.transactionDetail.lg};
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
`

const DetailLaptop = styled.div`
  /* background-color: rgba(255, 0, 255, 0.5); */
  position: sticky;
  min-width: ${transactionMenuWidth}px;
  max-height: calc(100vh - ${headerHeight}px);
  top: ${headerHeight}px;
  overflow-y: auto;
  z-index: ${({ theme }) => theme.zIndex.transactionDetail.lg};
  padding: 1rem;
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
    top 0.3s ease,
    left 0.3s ease;
`

interface TransactionMenuProps {
  selectedDay: string
  dailyTransactions: Transaction[]
  isOpen: boolean
  isDownLaptop: boolean
  onClose: () => void
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
}

const TransactionDetail = ({
  selectedDay,
  dailyTransactions,
  isDownLaptop,
  isOpen,
  onClose: handleClose,
  onAddClick: handleAddClick,
  onCardClick: handleCardClick,
}: TransactionMenuProps) => {
  const portalRenderer = usePortal('half-modal')
  const { isNavigationMenuOpen } = useApp()

  const menuContent = (
    <Stack sx={{ height: '100%' }} spacing={2}>
      <Typography fontWeight={'fontWeightBold'}>{selectedDay}</Typography>
      {/* 収入・支出・残高 表示エリア */}
      <DailySummary dailyTransactions={dailyTransactions} />
      {/* 内訳タイトル&内訳追加ボタン */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
        }}
      >
        {/* 左側のメモアイコンとテキスト */}
        <Box display="flex" alignItems="center">
          <Notes sx={{ mr: 1 }} />
          <Typography variant="body1">内訳</Typography>
        </Box>
        {/* 右側の追加ボタン */}
        <Button startIcon={<AddCircle />} color="primary" onClick={handleAddClick}>
          内訳を追加
        </Button>
      </Box>

      {/* 内訳内容部分 */}
      <Box sx={{ flexGrow: 1 }}>
        <List aria-label="取引履歴">
          <Stack spacing={2}>
            {/* 内訳マップ部分 */}
            {dailyTransactions.map((transaction) => (
              <ListItem disablePadding key={transaction.id}>
                <Card
                  sx={{
                    width: '100%',
                    backgroundColor:
                      transaction.type === 'income'
                        ? theme.palette.incomeColor.light
                        : theme.palette.expenseColor.light,
                  }}
                >
                  <CardActionArea onClick={handleCardClick(transaction)}>
                    <CardContent>
                      <Grid container spacing={1} alignItems="center" wrap="wrap">
                        <Grid size={{ xs: 1 }}>{IconComponents[transaction.category]}</Grid>
                        <Grid size={{ xs: 2 }}>
                          <Typography variant="caption" display="block" gutterBottom>
                            {transaction.category}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography variant="body2" gutterBottom>
                            {transaction.content}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 4 }}>
                          <Typography
                            gutterBottom
                            textAlign={'right'}
                            color="text.secondary"
                            sx={{
                              wordBreak: 'break-all',
                            }}
                          >
                            ¥{formatCurrency(transaction.amount)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </ListItem>
            ))}
          </Stack>
        </List>
      </Box>
    </Stack>
  )

  return (
    <>
      {isDownLaptop ? (
        // タブレット以下
        portalRenderer(
          <>
            <Mask
              id="test-mask"
              $isOpen={isOpen}
              $zIndex={theme.zIndex.transactionDetail.md - 1}
              onClick={handleClose}
            />
            <DetailTablet id="test-real" $isNavigationMenuOpen={isNavigationMenuOpen} $isOpen={isOpen}>
              {menuContent}
            </DetailTablet>
          </>
        )
      ) : (
        // ラップトップ以上
        <StickyContext>
          <DetailLaptop>{menuContent}</DetailLaptop>
        </StickyContext>
      )}
    </>
  )
}

export default TransactionDetail
