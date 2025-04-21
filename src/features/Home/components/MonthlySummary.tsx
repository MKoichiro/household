import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { ArrowUpward, ArrowDownward, AccountBalance } from '@mui/icons-material'
import { Transaction } from '../../../shared/types'
import { financeCalculations } from '../../../shared/utils/financeCalculations'
import { formatCurrency } from '../../../shared/utils/formatting'

// map用型
// interface GridMapType {
//   bgcolor: string
//   text: '収入' | '支出' | '残高'
//   icon: ComponentType
//   amount: number
// }

// map用配列
// const GridMap: GridMapTypeMapType[] = [
//   { bgcolor: theme.palette.incomeColor.main, text: "収入", icon: ArrowUpward, amount: income },
//   { bgcolor: theme.palette.expenseColor.main, text: "支出", icon: ArrowDownward, amount: expense },
//   { bgcolor: theme.palette.balanceColor.main, text: "残高", icon: AccountBalance, amount: balance },
// ]

export interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  const { income, expense, balance } = financeCalculations(monthlyTransactions)

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }} mb={2}>
      {/* 収入 */}
      <Grid size={{ xs: 4 }} display="flex" flexDirection="column">
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.incomeColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction="row">
              <ArrowUpward sx={{ fontSize: '2rem' }} />
              <Typography>収入</Typography>
            </Stack>
            <Typography
              textAlign="right"
              variant="h5"
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: {
                  xs: '.8rem',
                  sm: '1rem',
                  md: '1.2rem',
                },
              }}
            >
              ￥{formatCurrency(income)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 支出 */}
      <Grid size={{ xs: 4 }} display="flex" flexDirection="column">
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.expenseColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction="row">
              <ArrowDownward sx={{ fontSize: '2rem' }} />
              <Typography>支出</Typography>
            </Stack>
            <Typography
              textAlign="right"
              variant="h5"
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: {
                  xs: '.8rem',
                  sm: '1rem',
                  md: '1.2rem',
                },
              }}
            >
              ￥{formatCurrency(expense)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 残高 */}
      <Grid size={{ xs: 4 }} display="flex" flexDirection="column">
        <Card
          sx={{
            bgcolor: (theme) => theme.palette.balanceColor.main,
            color: 'white',
            borderRadius: '10px',
            flexGrow: 1,
          }}
        >
          <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
            <Stack direction="row">
              <AccountBalance sx={{ fontSize: '2rem' }} />
              <Typography>残高</Typography>
            </Stack>
            <Typography
              textAlign="right"
              variant="h5"
              fontWeight={'fontWeightBold'}
              sx={{
                wordBreak: 'break-word',
                fontSize: {
                  xs: '.8rem',
                  sm: '1rem',
                  md: '1.2rem',
                },
              }}
            >
              ￥{formatCurrency(balance)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default MonthlySummary
