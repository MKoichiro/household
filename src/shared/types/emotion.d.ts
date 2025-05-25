// Emotion の Theme を MUI の Theme で拡張
import '@emotion/react'
import type { Theme as MuiTheme } from '@mui/material/styles'

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends MuiTheme {}
}

// これにより、@emotion/styled のstyled 関数を用いてタグ付きテンプレート記法の中で、theme を暗黙的に引数として受け取ることができるようになる。
// 特に、ブレイクポイントを統合できるのが便利。

// 例

// // @emotion/styled には emotion が提供する「styled-components の styled と同等の styled」をインポート
// import styled from '@emotion/styled'

// const StyledDiv = styled.div<{ $open: number }>` // $open のみを明示的に指定
//   background-color: ${({ theme }) => theme.palette.primary.main};
//   height: ${({ $open }) => ($open ? '100px' : '50px')};

//   /* メディアクエリ: ${} が "@media (max-width: 600px)" に展開される */
//   ${({ theme }) => theme.breakpoints.down('sm')} {
//     max-width: 90vw;
//   }
// `

// 例: 使用側
// <StyledDiv $open={isOpen} />
