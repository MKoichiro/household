import { Box, Card, CardContent, Grid, Typography } from '@mui/material'
import type { GridSize } from '@mui/material/Grid'
import type { ResponsiveStyleValue } from '@mui/system'

import type { Transaction, TransactionDisplayType, TransactionKeyType } from '@shared/types'
import { financeCalculations } from '@shared/utils/financeCalculations'
import { formatCurrency } from '@shared/utils/formatting'
import { cpf } from '@styles/theme/helpers/colorPickers'

const gridSize: Record<TransactionKeyType, ResponsiveStyleValue<GridSize>> = {
  income: { xs: 12, md: 4, lg: 12 },
  expense: { xs: 12, md: 4, lg: 12 },
  balance: { xs: 12, md: 4, lg: 12 },
}

interface GridMapType {
  name: TransactionKeyType
  display: TransactionDisplayType
  size: ResponsiveStyleValue<GridSize>
  amount: number
}

interface DailySummaryProps {
  dailyTransactions: Transaction[]
}

const DailySummary = ({ dailyTransactions }: DailySummaryProps) => {
  const { income, expense, balance } = financeCalculations(dailyTransactions)

  const gridMap: GridMapType[] = [
    { name: 'income', display: '収入', size: gridSize.income, amount: income },
    { name: 'expense', display: '支出', size: gridSize.expense, amount: expense },
    { name: 'balance', display: '残高', size: gridSize.balance, amount: balance },
  ]

  return (
    <Box>
      <Grid container spacing={1}>
        {gridMap.map((item) => (
          <Grid key={item.name} size={item.size} display="flex">
            <Card
              sx={{
                bgcolor: cpf('ui.dailySummary.bg'),
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: { sm: 'row', md: 'column', lg: 'row', xl: 'column' },
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography
                  noWrap
                  textAlign="center"
                  variant="subtitle2"
                  sx={{
                    color: cpf(`${item.name}.font.darker`),
                    flexShrink: 0,
                    alignSelf: 'flex-start',
                  }}
                >
                  {item.display}
                </Typography>
                <Typography
                  textAlign="right"
                  fontWeight="fontWeightBold"
                  sx={{
                    color: cpf(`${item.name}.font.lighter`),
                    alignSelf: 'flex-end',
                    wordBreak: 'break-all',
                  }}
                >
                  ¥{formatCurrency(item.amount)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default DailySummary
