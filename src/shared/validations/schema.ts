import { z } from 'zod'
import { parseIntFromCommaSeparated } from '../utils/formatting'

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  date: z.string().nonempty({ message: '日付は必須です' }),
  amount: z
    .string()
    .nonempty({ message: '金額は必須です' })
    .refine((val) => parseInt(val) > 0, {
      message: '金額は1円以上で入力してください',
    })
    .refine((val) => parseInt(val) < 1000000000, {
      message: '金額は10桁（10億円）未満で入力してください',
    })
    .refine((val) => !isNaN(parseIntFromCommaSeparated(val)), {
      message: '無効な値です',
    }),
  content: z.string().max(120, '内容は120文字以内にしてください'),
  category: z
    .union([
      z.enum(['食費', '日用品', '住居費', '交際費', '娯楽', '交通費']),
      z.enum(['給与', '副収入', 'お小遣い']),
      z.literal(''),
    ])
    .refine((val) => val !== '', { message: 'カテゴリを選択してください' }),
})

export type Schema = z.infer<typeof transactionSchema>
