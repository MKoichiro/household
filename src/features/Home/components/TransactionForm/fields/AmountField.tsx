import { TextField } from '@mui/material'
import { Control, Controller, ControllerRenderProps, FieldErrors } from 'react-hook-form'
import { TransactionFormValues } from '../../../../../shared/types'

interface AmountFieldProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
  onBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
}

const AmountField = ({ control, errors, onBlur: handleBlur }: AmountFieldProps) => {
  return (
    <Controller
      name="amount"
      control={control}
      render={({ field }) => (
        <TextField
          error={!!errors.amount}
          helperText={errors.amount?.message}
          {...field}
          label="金額"
          type="number"
          onBlur={handleBlur(field)}
          slotProps={{ htmlInput: { style: { fontSize: '16px' } } }}
        />
      )}
    />
  )
}

export default AmountField
