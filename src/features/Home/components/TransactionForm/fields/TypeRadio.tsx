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
              color="error"
              onClick={handleClick('expense')}
            >
              支出
            </Button>
            <Button variant={field.value === 'income' ? 'contained' : 'outlined'} onClick={handleClick('income')}>
              収入
            </Button>
          </ButtonGroup>
        )
      }}
    />
  )
}

export default TypeRadio
