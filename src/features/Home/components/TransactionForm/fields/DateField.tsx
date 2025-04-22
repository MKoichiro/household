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
          {...field}
          label="日付"
          type="date"
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.date}
          helperText={errors.date?.message}
        />
      )}
    />
  )
}

export default DateField
