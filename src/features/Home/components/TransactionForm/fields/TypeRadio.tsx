import { Control, Controller, ControllerRenderProps } from 'react-hook-form'
import { TransactionFormValues } from '../../../../../shared/types'
import { MouseEvent } from 'react'
import TransactionTypeToggleButton from '../../../../../components/common/TransactionTypeToggleButton'

interface TypeRadioProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  onTypeChange: (type: 'expense' | 'income') => (event: MouseEvent<HTMLElement>) => void
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
