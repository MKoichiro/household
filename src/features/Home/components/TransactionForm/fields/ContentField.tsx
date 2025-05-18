import { TextField } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { TransactionFormValues } from '../../../../../shared/types'

interface ContentFieldProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
}

const ContentField = ({ control, errors }: ContentFieldProps) => {
  return (
    <Controller
      name="content"
      control={control}
      render={({ field }) => (
        <TextField
          error={!!errors.content}
          helperText={errors.content?.message}
          {...field}
          label="内容"
          type="text"
          slotProps={{ htmlInput: { style: { fontSize: '16px' } } }}
        />
      )}
    />
  )
}

export default ContentField
