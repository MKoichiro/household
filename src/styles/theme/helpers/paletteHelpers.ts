import { PaletteColor, Theme } from '@mui/material'

export const colorPicker =
  (path: string, shade?: keyof PaletteColor) =>
  (theme: Theme): string => {
    // ドット区切りでネストアクセス
    const keys = path.split('.') as (keyof Theme['palette'])[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let entry: any = theme.palette
    for (const key of keys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      entry = entry[key]
    }
    // 指定色（main/light/dark/etc.）を返す
    const shadeKey = shade ? shade : theme.palette.mode
    return (entry as PaletteColor)[shadeKey]
  }
