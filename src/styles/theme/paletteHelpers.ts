import { PaletteColor, Theme } from '@mui/material'

/**
 * 色を取得を簡素化するためのヘルパー関数
 * color: (theme) => theme.palette.myKey.main
 * を
 * color: cp('myKey')
 * のように簡素化できる。
 * ※ エディタの補完が効かないので、一長一短。動作確認後に切り替えるとすっきりする。
 * @param key - 色のキー
 * @param shade - 色の濃淡を表す最後のキー（デフォルトは'main'）
 * @returns - themeを引数にとり、指定された色を返す関数
 * @example
 * ```ts
 *   import { colorPicker as cp } from 'path/to/paletteHelpers'
 *   <MuiComponent sx={{ color: cp('primary', 'dark') }} />
 *   <MuiComponent sx={{ color: cp('myPalette.myColor') }} />
 * ```
 * NG: shade まで指定することはできない
 * ```ts
 *   <MuiComponent sx={{ color: cp('primary.main') }} />
 * ```
 */
export const colorPicker =
  <K extends keyof Theme['palette']>(key: K, shade: keyof PaletteColor = 'main') =>
  (theme: Theme): string => {
    const entry = theme.palette[key] as PaletteColor
    return entry[shade]
  }
