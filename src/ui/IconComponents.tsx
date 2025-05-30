import type { JSX } from 'react'

import {
  AlarmIcon,
  FastfoodIcon,
  AddHomeIcon,
  Diversity3Icon,
  SportsTennisIcon,
  AddBusinessIcon,
  SavingsIcon,
  TrainIcon,
  WorkIcon,
} from '@shared/icons'
import type { ExpenseCategory, IncomeCategory } from '@shared/types'

const IconComponents: Record<IncomeCategory | ExpenseCategory, JSX.Element> = {
  // income
  給与: <WorkIcon fontSize="small" />,
  副収入: <AddBusinessIcon fontSize="small" />,
  お小遣い: <SavingsIcon fontSize="small" />,

  // expense
  食費: <FastfoodIcon fontSize="small" />,
  日用品: <AlarmIcon fontSize="small" />,
  住居費: <AddHomeIcon fontSize="small" />,
  交際費: <Diversity3Icon fontSize="small" />,
  娯楽: <SportsTennisIcon fontSize="small" />,
  交通費: <TrainIcon fontSize="small" />,
}

export default IconComponents
