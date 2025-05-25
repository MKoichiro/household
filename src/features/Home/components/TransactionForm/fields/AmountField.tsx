import { TextField } from '@mui/material'
import { Control, Controller, ControllerRenderProps, FieldErrors, useFormContext } from 'react-hook-form'
import { TransactionFormValues } from '../../../../../shared/types'
import { ChangeEvent } from 'react'

interface AmountFieldProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
  onBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
}

const AmountField = ({ control, errors, onBlur: handleBlur }: AmountFieldProps) => {
  const { trigger } = useFormContext<TransactionFormValues>()
  const handleChange = (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      field.onChange(e) // RHF のデフォルトの onChange を手動で実行しておく
      void trigger('amount') // バリデーションをトリガー
    }
  }

  return (
    <Controller
      name="amount"
      control={control}
      render={({ field }) => (
        <TextField
          required
          error={!!errors.amount}
          helperText={errors.amount?.message}
          {...field}
          onChange={handleChange(field)}
          label="金額"
          type="number"
          onBlur={handleBlur(field)}
          slotProps={{
            htmlInput: {
              style: { fontSize: '16px' },
              min: 0, // 0円以上を許可
            },
          }}
        />
      )}
    />
  )
}

export default AmountField
