import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Drawer,
  Grid,
  List,
  ListItem,
  Stack,
  Typography,
} from '@mui/material'
import { Notes, AddCircle } from '@mui/icons-material'
import { theme } from '../theme/theme'
import DailySummary from './DailySummary'
import { Transaction } from '../types'
import { formatCurrency } from '../utils/formatting'
import IconComponents from './common/IconComponents'
import { headerHeight, sidePanelWidth } from '../constants/ui'

interface TransactionMenuProps {
  selectedDay: string
  dailyTransactions: Transaction[]
  isDrawerOpen: boolean
  isUnderLG: boolean
  onDrawerClose: () => void
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
}

const TransactionMenu = ({
  selectedDay,
  dailyTransactions,
  isUnderLG,
  isDrawerOpen,
  onDrawerClose: handleDrawerClose,
  onAddClick: handleAddClick,
  onCardClick: handleCardClick,
}: TransactionMenuProps) => {
  return (
    <Drawer
      sx={{
        width: isUnderLG ? 'auto' : sidePanelWidth,
        '& .MuiDrawer-paper': {
          width: isUnderLG ? 'auto' : sidePanelWidth,
          boxSizing: 'border-box',
          p: 2,
          ...(isUnderLG && {
            height: '70vh',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isUnderLG && {
            top: headerHeight,
            height: `calc(100% - ${headerHeight}px)`,
          }),
        },
      }}
      variant={isUnderLG ? 'temporary' : 'permanent'} // 表示の指定
      anchor={isUnderLG ? 'bottom' : 'right'}
      open={isDrawerOpen}
      onClose={handleDrawerClose}
      slotProps={{
        root: {
          keepMounted: true, // Better open performance on mobile.
        },
      }}
    >
      <Stack sx={{ height: '100%' }} spacing={2}>
        <Typography fontWeight={'fontWeightBold'}>日時： {selectedDay}</Typography>

        {/* 収入・支出・残高 表示エリア */}
        <DailySummary isUnderLG={isUnderLG} dailyTransactions={dailyTransactions} />

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
        <Box
          sx={{
            flexGrow: 1,
            // overflowY: "auto"
            // overScrollBehavior: "contain"
          }}
        >
          <List aria-label="取引履歴">
            <Stack spacing={2}>
              {/* 内訳マップ部分 */}
              {dailyTransactions.map(transaction => (
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
    </Drawer>
  )
}

export default TransactionMenu
