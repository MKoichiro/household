import { Paper } from '@mui/material'
import { usePortal } from '../../../shared/hooks/useContexts'

const HeaderMenuContent = () => {
  // const test = usePortal('headerModalMenu')
  return (
    <Paper sx={{ bgcolor: (theme) => theme.palette.header.main }}>
      <ul>
        <li>サインアップ</li>
        <li>ログイン</li>
      </ul>
    </Paper>
  )
}

const HeaderMenu = () => {
  const portalRenderer = usePortal('headerModalMenu')
  return <>{portalRenderer(<HeaderMenuContent />)}</>
}

export default HeaderMenu

// マスクは付けず、背景は操作可能
// バックグラウンドはヘッダーカラーと合わせる
// プロップスで表示するli、つまり、ボタンを切り替える
