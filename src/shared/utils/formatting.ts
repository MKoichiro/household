import { format } from 'date-fns'

export function formatMonth(date: Date): string {
  return format(date, 'yyyy-MM')
}

// "99" -> 99, "1,000" -> 1000, "001,234" -> 1234
export function parseIntFromCommaSeparated(numberLike: string): number {
  // 使用者責任にするか関数内でエラーを返すか
  // const cleaned = numberLike.replace(/,/g, '').replace(/^0+/, '') || "0"
  // if (isNaN(cleaned)) {
  //   throw new Error("数値変換が不可能な値が渡されました。")
  // } else {
  //   return cleaned
  // }
  const cleaned = numberLike.replace(/,/g, '').replace(/^0+/, '') || '0'
  return Number(cleaned)
}
// console.log('001,234', parseIntFromCommaSeparated("001,234"))

export function formatCurrency(amount: number | string): string {
  if (typeof amount === 'number') {
    return amount.toLocaleString('ja-JP')
  }

  // 使用者責任にするか関数内でエラーを返すか
  // const parsedValue = parseIntFromCommaSeparated(amount)
  // if (isNaN(parsedValue)) {
  //   throw new Error("数値変換が不可能な値が渡されました。")
  // } else {
  //   return parsedValue
  // }
  return parseIntFromCommaSeparated(amount).toLocaleString('ja-JP')
}
// console.log('001,234', formatCurrency("001,234"))

export function getFormattedToday() {
  return format(new Date(), 'yyyy-MM-dd')
}
