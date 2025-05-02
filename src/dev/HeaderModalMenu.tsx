// 使用側の例

import styled from '@emotion/styled'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ContextMenuOrigin, { MenuTree } from './ContextMenu'
import { List, ListItem, ListItemText, ListItemButton, Paper } from '@mui/material'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`
// コンポーネント外で定義、またはコンポーネント内でメモ化して定義すること。
export const menuTree: MenuTree[] = [
  {
    id: '1-nest-1',
    display: '1st ネストメニューを表示',
    children: [
      {
        id: '1-1-nest-1',
        display: '2nd-1 ネストメニューを表示',
        children: [
          { id: '1-1-1-norm-1', display: '3rd-1 メニュー' },
          { id: '1-1-3-norm-2', display: '3rd-1 メニュー' },
        ],
      },
      {
        id: '1-2-nest-2',
        display: '2nd-1 ネストメニューを表示',
        children: [
          { id: '1-2-1-norm-1', display: '3rd-2 メニュー' },
          { id: '1-2-2-norm-2', display: '3rd-2 メニュー' },
        ],
      },
    ],
  },
  { id: '2-norm-1', display: <StyledLink to="/">公開ページ</StyledLink> },
  {
    id: '3-nest-2',
    display: '1st ネストメニューを表示',
    children: [
      { id: '3-1-norm-1', display: '2nd-2 メニュー' },
      {
        id: '3-2-nest-1',
        display: '2nd-2 ネストメニューを表示',
        children: [
          { id: '3-2-1-norm-1', display: '3rd-3 メニュー' },
          { id: '3-2-2-norm-2', display: '3rd-3 メニュー' },
        ],
      },
    ],
  },
]

const HeaderMenuRoot = () => {
  const [firstOpen, setFirstOpen] = useState(false)

  const handleToggle = () => setFirstOpen((prev) => !prev)
  const handleClose = () => setFirstOpen(false)

  const [open, setOpen] = useState(false)

  const handleToggle2 = () => setOpen((prev) => !prev)
  const handleClose2 = () => setOpen(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const toggleBtnRef = useRef<HTMLElement>(null)

  return (
    <>
      <button onClick={handleToggle}>Toggle</button>
      {/* <ContextMenuOrigin open={firstOpen} menuTree={menuTree} onClose={handleClose} /> */}
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
        <Paper sx={{ width: 600, mx: 'auto' }}>
          <List>
            {Array.from({ length: 3 }, (_, i) => `ダミー項目 ${i + 1}`).map((text, index) => (
              <ListItem key={text} sx={{ height: 100 }}>
                {index === 0 ? (
                  <ListItemButton id="dfghjk" ref={anchorRef} sx={{ height: '100px' }}>
                    <ListItemText primary={text} onClick={handleToggle2} ref={toggleBtnRef} />
                    {/* <ContextMenuOrigin
                      open={open}
                      menuTree={menuTree}
                      onClose={handleClose2}
                      closeBtnRef={toggleBtnRef}
                      direction="right"
                      anchorRef={anchorRef}
                      relativePositionStrategy="outerBottomRight"
                    /> */}
                  </ListItemButton>
                ) : (
                  <ListItemButton>
                    <ListItemText primary={text} />
                  </ListItemButton>
                )}
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </>
  )
}

export default HeaderMenuRoot
