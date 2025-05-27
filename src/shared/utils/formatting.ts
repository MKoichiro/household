import { format } from 'date-fns'

export function formatMonth(date: Date): string {
  return format(date, 'yyyy-MM')
}

// "99" -> 99, "1,000" -> 1000, "001,234" -> 1234
export function parseIntFromCommaSeparated(numberLike: string): number {
  const cleaned = numberLike.replace(/,/g, '').replace(/^0+/, '') || '0'
  return Number(cleaned)
}

export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'number') {
    return amount.toLocaleString('ja-JP')
  }
  return parseIntFromCommaSeparated(amount).toLocaleString('ja-JP')
}

export function getFormattedToday() {
  return format(new Date(), 'yyyy-MM-dd')
}
