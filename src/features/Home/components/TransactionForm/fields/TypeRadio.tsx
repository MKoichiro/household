import type { MouseEvent } from 'react'
import type { Control, ControllerRenderProps } from 'react-hook-form'
import { Controller } from 'react-hook-form'

import TransactionTypeToggleButton from '@ui/TransactionTypeToggleButton'
import type { TransactionFormValues } from '@shared/types'

interface TypeRadioProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  onTypeChange: (type: 'expense' | 'income') => (e: MouseEvent<HTMLElement>) => void
}

const TypeRadio = ({ control, onTypeChange }: TypeRadioProps) => {
  const handleChange =
    (field: ControllerRenderProps<TransactionFormValues, 'type'>) =>
    (e: MouseEvent<HTMLElement>, newValue: 'expense' | 'income') => {
      if (newValue) {
        field.onChange(newValue)
        onTypeChange(newValue)(e)
      }
    }
  return (
    <Controller
      name="type"
      control={control}
      render={({ field }) => (
        <TransactionTypeToggleButton currentType={field.value} handleChange={handleChange(field)} />
      )}
    />
  )
}

export default TypeRadio
