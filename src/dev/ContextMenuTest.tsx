// src/components/HeaderMenuRoot.tsx
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { List, ListItem, ListItemText, Paper, Button, Box, Typography } from '@mui/material'
import ContextMenuOrigin from '../components/common/ContextMenu/ContextMenuOrigin'
import type { MenuTree } from '../components/common/ContextMenu/types'
import useContextMenu, { ContextMenuConfigs } from '../components/common/ContextMenu/hooks/useContextMenu'

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
        display: '2nd-2 ネストメニューを表示',
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
    display: '1st-2 ネストメニューを表示',
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

const configs: ContextMenuConfigs[] = [
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
  // {
  //   id: 'test-clicked-anchor-right-click',
  //   menuTree,
  //   autoIcon: true,
  //   position: {
  //     type: 'clicked',
  //     clicked: 'anchor',
  //     cursorRelativity: 'center',
  //     offset: { x: 0, y: 0 },
  //   },
  // },
]

const HeaderMenuRoot = () => {
  const {
    register,
    anchorRefs,
    // closeBtnRefs,
    handleToggle,
    handleOpen,
    handleOpenOnly,
    handleClose,
    handleToggleOnly,
    handleCloseAll,
    clickAwayRefs,
  } = useContextMenu(configs)

  // 各 config の説明文を作るヘルパー
  const describe = (cfg: ContextMenuConfigs) => {
    const { position, autoIcon } = cfg
    switch (position.type) {
      case 'clicked':
        return `mode: clicked(${position.clicked}), cursor: ${position.cursorRelativity}, offset: [${position.offset!.x}, ${position.offset!.y}], autoIcon: ${autoIcon}`
      case 'anchor':
        return `mode: anchor, relativity: ${position.anchorRelativity}, offset: [${position.offset!.x}, ${position.offset!.y}], autoIcon: ${autoIcon}`
      case 'custom':
        return `mode: custom, top: ${position.custom.top}, left: ${position.custom.left}, transform: ${position.custom.transform}, autoIcon: ${autoIcon}`
    }
  }

  return (
    <Box
      sx={{
        my: 4,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Paper sx={{ width: { sm: '90%', md: '70%', lg: '50%' }, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          ContextMenu テスト
        </Typography>
        <List>
          {configs.map((cfg) => (
            <ListItem
              key={cfg.id}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                mb: 2,
                border: '1px solid #ddd',
                borderRadius: 1,
                p: 2,
              }}
              ref={clickAwayRefs}
            >
              <ListItemText
                primary={cfg.id}
                secondary={describe(cfg)}
                // 右クリックでのメニュー展開の例
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleOpen[cfg.id](e)
                }}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                <Button variant="contained" size="small" ref={anchorRefs[cfg.id]} onClick={handleToggle[cfg.id]}>
                  toggle
                </Button>
                <Button variant="outlined" size="small" onClick={handleOpen[cfg.id]}>
                  open
                </Button>
                <Button variant="outlined" size="small" onClick={handleOpenOnly[cfg.id]}>
                  openOnly
                </Button>
                <Button variant="outlined" size="small" onClick={handleClose[cfg.id]}>
                  close
                </Button>
                <Button variant="outlined" size="small" onClick={handleToggleOnly[cfg.id]}>
                  toggleOnly
                </Button>
              </Box>

              {/* この位置でレンダラーを置いておく */}
              <ContextMenuOrigin {...register[cfg.id]} />
            </ListItem>
          ))}

          {/* 全閉じボタン */}
          <ListItem>
            <Button variant="contained" color="error" onClick={handleCloseAll}>
              全メニューを閉じる
            </Button>
          </ListItem>
        </List>
      </Paper>
    </Box>
  )
}

export default HeaderMenuRoot
