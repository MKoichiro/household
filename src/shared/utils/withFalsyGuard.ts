/**
 * @param checkFalsy - falsy な可能性のある値
 * @param orDo - falsy でない場合に truthy である保証を得た値を引数にして実行する関数
 * @returns
 */
export const withFalsyGuard = <T, U>({
  checkFalsy,
  orDo,
}: {
  checkFalsy: { [name: string]: T | undefined | null | false }
  orDo: (checked: T) => U
}) => {
  const [[key, value]] = Object.entries(checkFalsy)
  if (!value) {
    if (import.meta.env.MODE !== 'production') {
      console.warn(`useContextMenuPosition: ${key} is falsy. This may cause unexpected behavior.`)
    }
    return
  } else {
    // truthy が保証された value を引数にして、orDoを実行
    orDo(value)
  }
}
