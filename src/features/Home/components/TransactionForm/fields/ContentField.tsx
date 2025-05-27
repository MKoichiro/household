import { TextField } from '@mui/material'
import type { ChangeEvent } from 'react'
import type { Control, ControllerRenderProps, FieldErrors } from 'react-hook-form'
import { Controller, useFormContext } from 'react-hook-form'

import type { TransactionFormValues } from '@shared/types'

interface ContentFieldProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
}

const ContentField = ({ control, errors }: ContentFieldProps) => {
  // NOTE: trigger は validation をディスパッチするための関数
  // useForm({ mode: 'onChange' }) はすべてのフィールドに影響してしまう。個別対応の場合はこのようになる。
  const { trigger } = useFormContext<TransactionFormValues>()
  const handleChange = (field: ControllerRenderProps<TransactionFormValues, 'content'>) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      field.onChange(e) // RHF のデフォルトの onChange を手動で実行しておく
      void trigger('content') // バリデーションをトリガー
    }
  }

  return (
    <Controller
      name="content"
      control={control}
      render={({ field }) => (
        <TextField
          required={false}
          error={!!errors.content}
          helperText={errors.content?.message}
          {...field}
          onChange={handleChange(field)}
          label="内容"
          type="text"
          slotProps={{ htmlInput: { style: { fontSize: '16px' } } }}
        />
      )}
    />
  )
}

export default ContentField
