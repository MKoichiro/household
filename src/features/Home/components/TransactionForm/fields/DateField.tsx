import { TextField } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { TransactionFormValues } from '../../../../../shared/types'

interface DateFieldProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
}

const DateField = ({ control, errors }: DateFieldProps) => {
  return (
    <Controller
      name="date"
      control={control}
      render={({ field }) => (
        <TextField
          required
          {...field}
          label="日付"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.date}
          helperText={errors.date?.message}
          // iphone実機で高さが縮んでしまうバグへの対処
          sx={{
            '& input[type=date]': {
              WebkitAppearance: 'none',
              height: '1.6em',
            },
            '& input[type="date"]::-webkit-date-and-time-value': {
              textAlign: 'left',
            },
          }}
        />
      )}
    />
  )
}

export default DateField
