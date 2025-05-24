import { Button, ButtonGroup } from '@mui/material'
import { Control, Controller } from 'react-hook-form'
import { TransactionFormValues } from '../../../../../shared/types'

interface TypeRadioProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  onClick: (type: 'expense' | 'income') => (event: React.MouseEvent<HTMLButtonElement>) => void
}

const TypeRadio = ({ control, onClick: handleClick }: TypeRadioProps) => {
  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => {
        return (
          <ButtonGroup fullWidth sx={{ height: '2.2em' }}>
            <Button
              variant={field.value === 'expense' ? 'contained' : 'outlined'}
              onClick={handleClick('expense')}
              sx={{
                bgcolor: (theme) =>
                  field.value === 'expense' ? theme.palette.expense.bg.lighter[theme.palette.mode] : 'transparent',
                color: (theme) =>
                  field.value === 'expense'
                    ? theme.palette.expense.font.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderTopColor: (theme) =>
                  field.value === 'expense'
                    ? theme.palette.expense.bg.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderBottomColor: (theme) =>
                  field.value === 'expense'
                    ? theme.palette.expense.bg.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderLeftColor: (theme) =>
                  field.value === 'expense'
                    ? theme.palette.expense.bg.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderRightColor: 'transparent',
              }}
            >
              支出
            </Button>
            <Button
              variant={field.value === 'income' ? 'contained' : 'outlined'}
              onClick={handleClick('income')}
              sx={{
                bgcolor: (theme) =>
                  field.value === 'income' ? theme.palette.income.bg.lighter[theme.palette.mode] : 'transparent',
                color: (theme) =>
                  field.value === 'income'
                    ? theme.palette.income.font.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderTopColor: (theme) =>
                  field.value === 'income'
                    ? theme.palette.income.bg.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderBottomColor: (theme) =>
                  field.value === 'income'
                    ? theme.palette.income.bg.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderRightColor: (theme) =>
                  field.value === 'income'
                    ? theme.palette.income.bg.lighter[theme.palette.mode]
                    : theme.palette.text.disabled,
                borderLeftColor: 'transparent',
              }}
            >
              収入
            </Button>
          </ButtonGroup>
        )
      }}
    />
  )
}

export default TypeRadio
