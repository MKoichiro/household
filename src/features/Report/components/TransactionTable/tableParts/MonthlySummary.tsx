import { Grid, Typography } from '@mui/material'

import type { SummaryFormatted } from '@shared/types'
import { formatCurrency } from '@shared/utils/formatting'
import { cpf } from '@styles/theme/helpers/colorPickers'

interface MonthlySummaryProps {
  summaryFormatted: SummaryFormatted
}

const MonthlySummary = ({ summaryFormatted: { income, expense, balance } }: MonthlySummaryProps) => {
  return (
    <Grid container sx={{ textAlign: 'center' }}>
      {[
        { title: '収入', color: cpf('income.font.lighter'), amount: formatCurrency(income) },
        { title: '支出', color: cpf('expense.font.lighter'), amount: formatCurrency(expense) },
        { title: '残高', color: cpf('balance.font.lighter'), amount: formatCurrency(balance) },
      ].map((item) => (
        <Grid key={item.title} size={{ xs: 4 }}>
          <Typography variant="subtitle1" component="h3">
            {item.title}
          </Typography>
          <Typography
            component="span"
            fontWeight="fontWeightBold"
            sx={{
              color: item.color,
              fontSize: '1.6rem',
              wordBreak: 'break-word',
            }}
          >
            ￥{item.amount}
          </Typography>
        </Grid>
      ))}
    </Grid>
  )
}

export default MonthlySummary
