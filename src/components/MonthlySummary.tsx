import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { ArrowUpward, ArrowDownward, AccountBalance } from '@mui/icons-material'
import { theme } from '../theme/theme'
import { Transaction } from '../types'
import { financeCalculations } from '../utils/financeCalculations'

// map用
// interface GridMapType {
//   bgcolor: string
//   text: '収入' | '支出' | '残高'
//   icon: ComponentType
//   amount: number
// }

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  const { income, expense, balance } = financeCalculations(monthlyTransactions)
  // console.log(income);
  // console.log(expense);
  // console.log(balance);

  // map用
  // const GridMap: GridMapTypeMapType[] = [
  //   { bgcolor: theme.palette.incomeColor.main, text: "収入", icon: ArrowUpward, amount: income },
  //   { bgcolor: theme.palette.expenseColor.main, text: "支出", icon: ArrowDownward, amount: expense },
  //   { bgcolor: theme.palette.balanceColor.main, text: "残高", icon: AccountBalance, amount: balance },
  // ]

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }} mb={2}>
      {/* 収入 */}
      <Grid size={{ xs: 4 }} display="flex" flexDirection="column">
        <Card
          sx={{
            bgcolor: theme.palette.incomeColor.main,
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
              ￥{income}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 支出 */}
      <Grid size={{ xs: 4 }} display="flex" flexDirection="column">
        <Card
          sx={{
            bgcolor: theme.palette.expenseColor.main,
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
              ￥{expense}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* 残高 */}
      <Grid size={{ xs: 4 }} display="flex" flexDirection="column">
        <Card
          sx={{
            bgcolor: theme.palette.balanceColor.main,
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
              ￥{balance}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default MonthlySummary
