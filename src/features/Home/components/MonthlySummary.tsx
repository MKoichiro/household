import { Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import { Transaction, TransactionKeyType } from '../../../shared/types'
import { financeCalculations } from '../../../shared/utils/financeCalculations'
import { formatCurrency } from '../../../shared/utils/formatting'
import { ElementType, useState } from 'react'
import { cpf } from '../../../styles/theme/helpers/colorPickers'
import { AccountBalanceIcon, ArrowDownwardIcon, ArrowUpwardIcon } from '../../../icons'

interface GridMapType {
  name: TransactionKeyType
  display: string
  palette: { bg: string; font: { title: string; amount: string }; icon: string }
  icon: ElementType
  value: number
}

export interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  const { income, expense, balance } = financeCalculations(monthlyTransactions)
  const [selected, setSelected] = useState<TransactionKeyType | null>(null)
  const handleClick = (name: TransactionKeyType) => () => {
    setSelected((prev) => (prev === name ? null : name))
  }

  const occupancy = (name: TransactionKeyType) =>
    selected === null ? { xs: 8 } : selected === name ? { xs: 16, md: 20 } : { xs: 4, md: 2 }

  const wordBreak = (name: TransactionKeyType) => {
    if (selected === null) return 'break-all'
    if (selected === name) return 'break-all'
    return 'normal'
  }

  const isShrunk = (name: TransactionKeyType) => selected !== null && selected !== name

  const isNeutral = selected === null

  const gridMap: GridMapType[] = [
    {
      name: 'income',
      display: '収入',
      palette: {
        bg: 'income.bg.lighter',
        font: { title: 'income.font.darker', amount: 'income.font.lighter' },
        icon: 'income.font.lighter',
      },
      icon: ArrowUpwardIcon,
      value: income,
    },
    {
      name: 'expense',
      display: '支出',
      palette: {
        bg: 'expense.bg.lighter',
        font: { title: 'expense.font.darker', amount: 'expense.font.lighter' },
        icon: 'expense.font.lighter',
      },
      icon: ArrowDownwardIcon,
      value: expense,
    },
    {
      name: 'balance',
      display: '残高',
      palette: {
        bg: 'balance.bg.lighter',
        font: { title: 'balance.font.darker', amount: 'balance.font.lighter' },
        icon: 'balance.font.lighter',
      },
      icon: AccountBalanceIcon,
      value: balance,
    },
  ]

  return (
    <Grid container spacing={{ xs: 1, sm: 2 }} mb={2} sx={{ maxWidth: '100%' }} columns={24}>
      {gridMap.map((item) => (
        <Grid
          key={item.name}
          size={occupancy(item.name)}
          display="flex"
          flexDirection="column"
          sx={{
            transition: (theme) => theme.transitions.create(['width', 'height'], { easing: 'ease', duration: '300ms' }),
          }}
        >
          <Card
            sx={{
              bgcolor: isShrunk(item.name) ? cpf(item.palette.bg) : cpf('ui.monthlySummary.bg'),
              cursor: 'pointer',
              borderRadius: '0.5rem',
              flexGrow: 1,
              padding: { xs: 1, sm: 2 },
              transition: 'background-color 300ms ease',
            }}
            onClick={handleClick(item.name)}
          >
            <CardContent
              sx={{
                height: '3em',
                padding: 0,
                '&:last-child': { padding: 0 },
                color: cpf(item.palette.font.title),
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <item.icon
                  sx={{
                    display: 'block',
                    flex: isShrunk(item.name) ? 1 : 'unset',
                    position: 'absolute',
                    top: isShrunk(item.name) ? '50%' : 0,
                    left: isShrunk(item.name) ? '50%' : 0,
                    transform: `${isShrunk(item.name) ? 'translate(-50%, -50%)' : 'translate(0)'} ${isNeutral ? 'scale(3.5)' : 'scale(1)'}`,
                    opacity: isNeutral ? 0.25 : 1,
                    color: cpf(item.palette.icon),
                    transition:
                      'transform 300ms ease, top 300ms ease, left 300ms ease, opacity 300ms ease, color 300ms ease',
                  }}
                />
                <Typography
                  sx={{
                    fontWeight: 'fontWeightBold',
                    flex: isShrunk(item.name) ? 0 : 'unset',
                    opacity: isShrunk(item.name) ? 0 : 1,
                    transition: 'opacity 300ms ease',
                    position: 'absolute',
                    top: 0,
                    left: {
                      xs: isNeutral ? '0.25em' : '1em',
                      lg: isNeutral ? '2.25em' : '1.25em',
                    },
                  }}
                >
                  {item.display}
                </Typography>
              </Stack>
              <Typography
                textAlign="right"
                marginTop="auto"
                fontWeight="fontWeightBold"
                noWrap={selected !== null && selected !== item.name}
                sx={{
                  wordBreak: wordBreak(item.name),
                  opacity: isShrunk(item.name) ? 0 : 1,
                  transition: 'opacity 300ms ease',
                  color: cpf(item.palette.font.amount),
                }}
              >
                ￥{formatCurrency(item.value)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default MonthlySummary
