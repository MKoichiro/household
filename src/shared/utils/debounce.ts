// 汎用関数の定義のため、any[]を許容する
/* eslint-disable @typescript-eslint/no-explicit-any */
export type Debounced<F extends (...args: any[]) => void> = ((...args: Parameters<F>) => void) & { cancel: () => void }

export function debounce<F extends (...args: any[]) => void>(func: F, wait: number): Debounced<F> {
  let timeout: ReturnType<typeof setTimeout> | undefined

  const debounced = ((...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as Debounced<F>

  // 残余タイマーのクリーンアップ用メソッドを定義
  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = undefined
    }
  }

  return debounced
}

// 例: 使用側
// const debouncedFunction = debounce((arg1: string, arg2: number) => {
//   console.log(arg1, arg2)
// }, 1000)
//
