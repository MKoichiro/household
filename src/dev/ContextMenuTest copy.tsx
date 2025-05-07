// src/components/HeaderMenuRoot.tsx
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemText, ListItemButton, Paper } from '@mui/material'
import ContextMenuOrigin from '../components/common/ContextMenu/ContextMenuOrigin'
import type { MenuTree } from '../components/common/ContextMenu/types'
import useContextMenu, { ContextMenuArgs } from '../components/common/ContextMenu/hooks/useContextMenu'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`

// あらかじめメニュー構造を定義
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

const configs: ContextMenuArgs[] = [
  {
    id: 'test-clicked-anchor',
    menuTree,
    autoIcon: true,
    position: {
      type: 'clicked',
      clicked: 'anchor',
      cursorRelativity: 'center',
      offset: { x: 0, y: 0 },
    },
  },
  {
    id: 'test-clicked-window',
    menuTree,
    autoIcon: true,
    position: {
      type: 'clicked',
      clicked: 'window',
      cursorRelativity: 'center',
      offset: { x: 0, y: 0 },
    },
  },
  {
    id: 'test-clicked-document',
    menuTree,
    autoIcon: true,
    position: {
      type: 'clicked',
      clicked: 'document',
      cursorRelativity: 'center',
      offset: { x: 0, y: 0 },
    },
  },
  {
    id: 'test-anchor-mode',
    menuTree,
    autoIcon: true,
    position: {
      type: 'anchor',
      anchorRelativity: 'innerBottomLeftCorner',
      offset: { x: 0, y: 0 },
    },
  },
  {
    id: 'test-custom-mode',
    menuTree,
    autoIcon: true,
    position: {
      type: 'custom',
      custom: { top: 100, left: 100, transform: 'none' },
    },
  },
]

const HeaderMenuRoot = () => {
  // １回だけ呼び出し。返り値はすべてマップになっています
  const {
    register, // Record<id, ContextMenuOriginProps>
    anchorRefs, // Record<id, RefObject<HTMLDivElement>>
    closeBtnRefs, // Record<id, RefObject<HTMLElement>>
    handleToggle, // Record<id, MouseEventHandler>
  } = useContextMenu<HTMLDivElement>(configs)

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper sx={{ width: { sm: '90%', md: '70%', lg: '50%' }, p: 2 }}>
        <List>
          {configs.map(({ id }) => (
            <ListItem key={id}>
              <ListItemButton ref={anchorRefs[id]} onClick={handleToggle[id]}>
                <ListItemText primary={id} ref={closeBtnRefs[id]} />
                {/* id ごとの登録情報をスプレッド */}
                <ContextMenuOrigin {...register[id]} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  )
}

export default HeaderMenuRoot
