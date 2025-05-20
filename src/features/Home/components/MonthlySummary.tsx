import { Card, CardContent, Grid, Stack, Theme, Typography } from '@mui/material'
import { Transaction } from '../../../shared/types'
import { financeCalculations } from '../../../shared/utils/financeCalculations'
import { formatCurrency } from '../../../shared/utils/formatting'
import { ElementType, useState } from 'react'
import { colorPicker as cp } from '../../../styles/theme/helpers/paletteHelpers'
import { AccountBalanceIcon, ArrowDownwardIcon, ArrowUpwardIcon } from '../../../icons'

interface GridMapType {
  name: 'income' | 'expense' | 'balance'
  display: string
  colorPath: keyof Theme['palette']
  icon: ElementType
  value: number
}

export interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  const { income, expense, balance } = financeCalculations(monthlyTransactions)

  const [selected, setSelected] = useState<'income' | 'expense' | 'balance' | null>(null)
  const handleClick = (name: 'income' | 'expense' | 'balance') => () => {
    setSelected((prev) => (prev === name ? null : name))
  }

  const occupancy = (name: 'income' | 'expense' | 'balance') =>
    selected === null ? { xs: 8 } : selected === name ? { xs: 16, md: 20 } : { xs: 4, md: 2 }

  const wordBreak = (name: 'income' | 'expense' | 'balance') => {
    if (selected === null) return 'break-all'
    if (selected === name) return 'break-all'
    return 'normal'
  }

  const isShrunk = (name: 'income' | 'expense' | 'balance') => selected !== null && selected !== name

  const isNeutral = selected === null

  const gridMap: GridMapType[] = [
    {
      name: 'income',
      display: '収入',
      colorPath: 'incomeColor',
      icon: ArrowUpwardIcon,
      value: income,
    },
    {
      name: 'expense',
      display: '支出',
      colorPath: 'expenseColor',
      icon: ArrowDownwardIcon,
      value: expense,
    },
    {
      name: 'balance',
      display: '残高',
      colorPath: 'balanceColor',
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
              bgcolor: isShrunk(item.name) ? cp(item.colorPath, 'light') : '',
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
                color: cp(item.colorPath, 'dark'),
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
                    color: isShrunk(item.name) ? 'white' : cp(item.colorPath, 'dark'),
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
