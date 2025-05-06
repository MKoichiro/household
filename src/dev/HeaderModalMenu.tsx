// 使用側の例

import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemText, ListItemButton, Paper } from '@mui/material'
import ContextMenuOrigin from '../components/common/ContextMenu/ContextMenuOrigin'
import { MenuTree } from '../components/common/ContextMenu/types'
import useContextMenu from '../components/common/ContextMenu/hooks/useContextMenu'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`

// コンポーネント外で定義、またはコンポーネント内でメモ化して定義すること。
const menuTree: MenuTree[] = [
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
  // clicked - anchor
  const clickedAnchor = useContextMenu<HTMLDivElement>({
    id: 'test-clicked-anchor',
    menuTree,
    autoIcon: true,
    position: { type: 'clicked', clicked: 'anchor', cursorRelativity: 'center', offset: { x: 0, y: 0 } },
  })

  // clicked - window
  const clickedWindow = useContextMenu<HTMLDivElement>({
    id: 'test-clicked-window',
    menuTree,
    autoIcon: true,
    position: { type: 'clicked', clicked: 'window', cursorRelativity: 'center', offset: { x: 0, y: 0 } },
  })

  // clicked - document
  const clickedDocument = useContextMenu<HTMLDivElement>({
    id: 'test-clicked-document',
    menuTree,
    autoIcon: true,
    position: { type: 'clicked', clicked: 'document', cursorRelativity: 'center', offset: { x: 0, y: 0 } },
  })

  // anchor モード
  const anchorMode = useContextMenu<HTMLDivElement>({
    id: 'test-anchor-mode',
    menuTree,
    autoIcon: true,
    position: { type: 'anchor', anchorRelativity: 'innerBottomLeftCorner', offset: { x: 0, y: 0 } },
  })

  // custom モード
  const customMode = useContextMenu<HTMLDivElement>({
    id: 'test-custom-mode',
    menuTree,
    autoIcon: true,
    position: { type: 'custom', custom: { top: 100, left: 100, transform: 'none' } },
  })

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ width: { sm: '90%', md: '70%', lg: '50%' }, p: 2 }}>
        <List>
          <ListItem>
            <ListItemButton ref={clickedAnchor.anchorRef} onClick={clickedAnchor.handleToggle}>
              <ListItemText primary="Clicked Anchor" ref={clickedAnchor.closeBtnRef} />
              <ContextMenuOrigin {...clickedAnchor.register} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton ref={clickedWindow.anchorRef} onClick={clickedWindow.handleToggle}>
              <ListItemText primary="Clicked Window" ref={clickedWindow.closeBtnRef} />
              <ContextMenuOrigin {...clickedWindow.register} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton ref={clickedDocument.anchorRef} onClick={clickedDocument.handleToggle}>
              <ListItemText primary="Clicked Document" ref={clickedDocument.closeBtnRef} />
              <ContextMenuOrigin {...clickedDocument.register} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton ref={anchorMode.anchorRef} onClick={anchorMode.handleToggle}>
              <ListItemText primary="Anchor Mode" ref={anchorMode.closeBtnRef} />
              <ContextMenuOrigin {...anchorMode.register} />
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton ref={customMode.anchorRef} onClick={customMode.handleToggle}>
              <ListItemText primary="Custom Mode (100×100px)" ref={customMode.closeBtnRef} />
              <ContextMenuOrigin {...customMode.register} />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    </div>
  )
}

export default HeaderMenuRoot
