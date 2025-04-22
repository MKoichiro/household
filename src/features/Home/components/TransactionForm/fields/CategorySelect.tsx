import { FormControl, FormHelperText, InputLabel, ListItemIcon, MenuItem, Select } from '@mui/material'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { ExpenseCategory, IncomeCategory, TransactionFormValues, TransactionType } from '../../../../../shared/types'
import { JSX } from 'react'
import {
  AddBusiness,
  AddHome,
  Alarm,
  Diversity3,
  Fastfood,
  Savings,
  SportsTennis,
  Train,
  Work,
} from '@mui/icons-material'

const expenseCategories: { label: ExpenseCategory; icon: JSX.Element }[] = [
  { label: '食費', icon: <Fastfood /> },
  { label: '日用品', icon: <Alarm fontSize="small" /> },
  { label: '住居費', icon: <AddHome fontSize="small" /> },
  { label: '交際費', icon: <Diversity3 fontSize="small" /> },
  { label: '娯楽', icon: <SportsTennis fontSize="small" /> },
  { label: '交通費', icon: <Train fontSize="small" /> },
]

const incomeCategories: { label: IncomeCategory; icon: JSX.Element }[] = [
  { label: '給与', icon: <Work fontSize="small" /> },
  { label: '副収入', icon: <AddBusiness fontSize="small" /> },
  { label: 'お小遣い', icon: <Savings fontSize="small" /> },
]

interface CategorySelectProps {
  control: Control<TransactionFormValues, object, TransactionFormValues>
  errors: FieldErrors<TransactionFormValues>
  currentType: TransactionType
}

const CategorySelect = ({ control, errors, currentType }: CategorySelectProps) => {
  return (
    <Controller
      name="category"
      control={control}
      render={({ field }) => {
        const categories = currentType === 'income' ? incomeCategories : expenseCategories
        return (
          <FormControl error={!!errors.category}>
            <InputLabel id="category-label">カテゴリ</InputLabel>
            <Select
              labelId="category-label"
              id="category-select"
              {...field}
              label="カテゴリ"
              MenuProps={{
                // ドロップダウンメニューがモーダル背後に隠れないようにzIndexを調整
                sx: { zIndex: (theme) => theme.zIndex.transactionForm.md + 10 },
              }}
            >
              {categories.map((category) => (
                <MenuItem value={category.label} key={category.label}>
                  <ListItemIcon>{category.icon}</ListItemIcon>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.category?.message}</FormHelperText>
          </FormControl>
        )
      }}
    />
  )
}

export default CategorySelect
