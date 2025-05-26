import { Theme } from '@mui/material/styles'
import { PaletteColor } from '@mui/material'

// オーバーロード宣言：theme を直接受け取る場合
function colorPickerFunction(path: string, shade?: keyof PaletteColor): (theme: Theme) => string
// オーバーロード宣言：{ theme } を受け取る場合
function colorPickerFunction(path: string, shade?: keyof PaletteColor): (props: { theme: Theme }) => string

// 実装
function colorPickerFunction(path: string, shade?: keyof PaletteColor) {
  // ドット区切りでネストされた Palette 配下のキーを列挙
  const keys = path.split('.') as (keyof Theme['palette'])[]

  return (arg: Theme | { theme: Theme }): string => {
    // theme を取り出し
    const theme = 'palette' in arg ? arg : arg.theme

    // ネストしたオブジェクトを掘り下げ
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let entry: any = theme.palette
    for (const key of keys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      entry = entry[key]
      if (entry == null) {
        throw new Error(`colorPickerFunction: theme.palette の中に "${key}" が見つかりません`)
      }
    }

    // モードが指定なければ theme.palette.mode を使う
    const shadeKey = shade ?? theme.palette.mode
    return (entry as PaletteColor)[shadeKey]
  }
}

/**
 * theme.palette.XXX[mode] もしくは theme.palette.XXX[shade] を返すユーティリティ
 *
 * @param theme MUI の theme
 * @param path 'primary.main' や 'path.to.my.color' のようにドット区切りで指定
 * @param shade keyof PaletteColor（'light' | 'dark' | 'main' など）。未指定なら theme.palette.mode を使う
 */
function colorPicker(theme: Theme, path: string, shade?: keyof PaletteColor): string {
  const keys = path.split('.') as (keyof Theme['palette'])[]
  // ネストされた palette オブジェクトを掘り下げ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let entry: any = theme.palette
  for (const key of keys) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    entry = entry[key]
    if (entry == null) {
      throw new Error(`colorPicker: theme.palette の中に "${key}" が見つかりません`)
    }
  }

  // 指定の shade、未指定なら light|dark どちらか（mode）を返す
  const shadeKey = shade ?? theme.palette.mode
  return (entry as PaletteColor)[shadeKey]
}

export { colorPickerFunction as cpf, colorPicker as cp }
