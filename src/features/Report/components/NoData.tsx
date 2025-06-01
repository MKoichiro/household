import { Typography } from '@mui/material'
import type { CSSProperties } from 'react'

const NoData = ({ width, height }: { width?: CSSProperties['width']; height?: CSSProperties['height'] }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'inherit',
        width: width ? width : 'auto',
        height: height ? height : '100%',
      }}
    >
      <Typography>データがありません。</Typography>
    </div>
  )
}

export default NoData
