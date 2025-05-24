import { Typography } from '@mui/material'

const NoData = () => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'inherit', height: '100%' }}
    >
      <Typography>データがありません。</Typography>
    </div>
  )
}

export default NoData
