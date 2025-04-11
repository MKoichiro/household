// Firestoreによるエラーかを判定する型ガード
function isDBError(error: unknown): error is { code: string; message: string } {
  return typeof error === 'object' && error !== null && 'code' in error
}

// DB操作後のcatchブロックの共通処理
export const outputDBErrors = (error: unknown) => {
  if (isDBError(error)) {
    console.error(error)
    console.error(error.message)
    console.error(error.code)
  } else {
    console.error('非Firestore由来のエラー: ', error)
  }
}
