import {
  Work,
  AddBusiness,
  Savings,
  Fastfood,
  Alarm,
  AddHome,
  Diversity3,
  SportsTennis,
  Train,
} from '@mui/icons-material'
import { ExpenseCategory, IncomeCategory } from '../../shared/types'
import { JSX } from 'react'

const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  // income
  給与: <Work fontSize="small" />,
  副収入: <AddBusiness fontSize="small" />,
  お小遣い: <Savings fontSize="small" />,

  // expense
  食費: <Fastfood fontSize="small" />,
  日用品: <Alarm fontSize="small" />,
  住居費: <AddHome fontSize="small" />,
  交際費: <Diversity3 fontSize="small" />,
  娯楽: <SportsTennis fontSize="small" />,
  交通費: <Train fontSize="small" />,
}

export default IconComponents
