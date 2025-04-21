import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import { theme } from '../../../styles/theme/theme'
import { Transaction } from '../../../shared/types'
import { financeCalculations } from '../../../shared/utils/financeCalculations'
import { formatCurrency } from '../../../shared/utils/formatting'

interface DailySummaryProps {
  dailyTransactions: Transaction[]
}

const DailySummary = ({ dailyTransactions }: DailySummaryProps) => {
  const { income, expense, balance } = financeCalculations(dailyTransactions)

  return (
    <Box>
      <Grid container spacing={2}>
        {/* 収入 */}
        <Grid size={{ xs: 12, md: 4, lg: 6 }} display={'flex'}>
          <Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                収入
              </Typography>
              <Typography
                color={theme.palette.incomeColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: 'break-all' }}
              >
                ¥{formatCurrency(income)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 支出 */}
        <Grid size={{ xs: 12, md: 4, lg: 6 }} display={'flex'}>
          <Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                支出
              </Typography>
              <Typography
                color={theme.palette.expenseColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: 'break-all' }}
              >
                ¥{formatCurrency(expense)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 残高 */}
        <Grid size={{ xs: 12, md: 4, lg: 12 }} display={'flex'}>
          <Card sx={{ bgcolor: theme.palette.grey[100], flexGrow: 1 }}>
            <CardContent>
              <Typography variant="body2" noWrap textAlign="center">
                残高
              </Typography>
              <Typography
                color={theme.palette.balanceColor.main}
                textAlign="right"
                fontWeight="fontWeightBold"
                sx={{ wordBreak: 'break-all' }}
              >
                ¥{formatCurrency(balance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DailySummary
