import type { Notifiers } from '@shared/hooks/useContexts'

// Firestoreによるエラーかを判定する型ガード
function isDBError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error
}

// DB操作後のcatchブロックの共通処理
export const outputDBErrors = (error: unknown) => {
  if (!import.meta.env.DEV) return

  if (isDBError(error)) {
    console.error(error)
    console.error(error.message)
    console.error(error.code)
  } else {
    console.error('非Firestore由来のエラー: ', error)
  }
}

// エラーハンドリング込みの関数を返す高階関数
// 第一引数: 通知作成用の関数
// 第二引数: tryで行う処理（関数）
// 第三引数: エラー出力以外の任意の処理（関数）
// 返り値: エラーハンドリング込みの関数
// 汎用関数なのでanyを許容
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withErrorHandling = <R, T extends (...args: any[]) => Promise<R>, U extends (...args: any[]) => any>(
  notifiers: Notifiers,
  asyncFn: T,
  catchFn?: U
) => {
  return async (...args: Parameters<T>): Promise<R> => {
    try {
      const result = await asyncFn(...args)
      notifiers.ok()
      return result
    } catch (error) {
      if (catchFn) catchFn(...args)
      notifiers.ng()
      outputDBErrors(error)
      throw error
    }
  }
}
