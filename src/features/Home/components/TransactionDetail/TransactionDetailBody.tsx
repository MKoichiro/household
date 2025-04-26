import { Box, Button, Card, CardActionArea, CardContent, Grid, List, ListItem, Stack, Typography } from '@mui/material'
import { Notes, AddCircle } from '@mui/icons-material'
import { theme } from '../../../../styles/theme/theme'
import DailySummary from './DailySummary'
import { Transaction } from '../../../../shared/types'
import { formatCurrency } from '../../../../shared/utils/formatting'
import IconComponents from '../../../../components/common/IconComponents'
import { format } from 'date-fns'

interface TransactionDetailProps {
  selectedDay: string
  dailyTransactions: Transaction[]
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
}

const TransactionDetailBody = ({
  selectedDay,
  dailyTransactions,
  onAddClick: handleAddClick,
  onCardClick: handleCardClick,
}: TransactionDetailProps) => {
  return (
    <Stack sx={{ height: '100%' }} spacing={2}>
      <Typography fontWeight={'fontWeightBold'}>{format(selectedDay, 'M月dd日')}</Typography>

      {/* 収入・支出・残高 表示エリア */}
      <DailySummary dailyTransactions={dailyTransactions} />

      {/* 内訳タイトル & 内訳追加ボタン */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 1,
        }}
      >
        {/* 左側のアイコンとテキスト */}
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
}

export default TransactionDetailBody
