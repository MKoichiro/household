// 汎用的な関数のため、any[]を許容する
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Debounced 関数の型定義。
 * 引数を受け取り、最後の呼び出しのみを遅延実行し、
 * cancel() で保留中の実行をキャンセルできます。
 */
export type Debounced<F extends (...args: any[]) => void> = ((...args: Parameters<F>) => void) & { cancel: () => void }

/**
 * func の呼び出しを wait ミリ秒だけ遅延させ、連続呼び出し時には
 * 最後の一度だけ実行されるようにデバウンスします。
 *
 * @param func - デバウンス対象の関数
 * @param wait - 遅延時間（ミリ秒）
 * @returns デバウンスされた関数
 */
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
