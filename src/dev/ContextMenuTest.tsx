import styled from '@emotion/styled'
import { List, ListItem, ListItemText, Paper, Button, Box, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import ContextMenu from '@ui/ContextMenu/ContextMenu'
import { useContextMenus } from '@ui/ContextMenu/hooks/useContextMenus'
import type { ContextMenusCommonConfig, ContextMenusConfigs, MenuTree } from '@ui/ContextMenu/types'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`

// あらかじめメニュー構造を定義
const menuTree: MenuTree[] = [
  {
    // id: '1st-1', // id は任意、無ければ内部生成して管理される。
    display: '1st ネストメニューを表示',
    children: [
      {
        display: '2nd-1 ネストメニューを表示',
        children: [{ display: '3rd-1 メニュー' }, { display: '3rd-1 メニュー' }],
      },
      {
        display: '2nd-2 ネストメニューを表示',
        children: [{ display: '3rd-2 メニュー' }, { display: '3rd-2 メニュー' }],
      },
    ],
  },
  { display: <StyledLink to="/">公開ページ</StyledLink> },
  {
    display: '1st-2 ネストメニューを表示',
    children: [
      { display: '2nd-2 メニュー' },
      {
        display: '2nd-2 ネストメニューを表示',
        children: [{ display: '3rd-3 メニュー' }, { display: '3rd-3 メニュー' }],
      },
    ],
  },
]

// 個別設定で上書き可能な共通設定
const commonConfig: ContextMenusCommonConfig = {
  menuTree,
  autoIcon: true,
  zIndex: 3000,
  direction: 'right',
  subMenuPosition: {
    strategy: 'absoluteTop',
    offsetY: 0,
  },
  position: {
    type: 'clicked',
    clicked: 'anchor',
    cursorRelativity: 'center',
    offset: { x: 0, y: 0 },
  },
  // animeConfigs: {...},
  closeOnClickAway: true, // closeOnClickAwayのみ、共通設定でのみ指定可能なオプション
}

const configs: ContextMenusConfigs = [
  {
    // id: 'test-clicked-anchor', // id は任意、無ければ内部生成して管理される。
    name: 'test-clicked-anchor', // name は内部的には無視される。
    // 他は共通設定を継承
  },
  {
    name: 'test-clicked-window',
    position: {
      type: 'clicked',
      clicked: 'window',
      cursorRelativity: 'center',
      offset: { x: 0, y: 0 },
    },
  },
  {
    name: 'test-clicked-document',
    position: {
      type: 'clicked',
      clicked: 'document',
      cursorRelativity: 'center',
      offset: { x: 0, y: 0 },
    },
  },
  {
    name: 'test-anchor-mode',
    position: {
      type: 'anchor',
      anchorRelativity: 'innerBottomLeftCorner',
      offset: { x: 0, y: 0 },
    },
  },
  {
    name: 'test-custom-mode',
    position: {
      type: 'custom',
      custom: { top: 100, left: 100, transform: 'none' },
    },
  },
]

const HeaderMenuRoot = () => {
  const {
    integratedConfigs: configsWithIds, // commonConfig を統合し、（未設定なら） id を付与した configs。idで各register, handler, refにアクセスできる。
    registers,
    anchorRefs,
    handleToggle,
    handleOpen,
    controlledOpen,
    handleClose,
    controlledToggle,
    handleCloseAll,
    clickAwayRef,
    opens,
    positionStyles,
  } = useContextMenus(configs, commonConfig)

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
          {configsWithIds.map((cfg) => (
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
              ref={clickAwayRef}
            >
              <ListItemText
                primary={cfg.name}
                secondary={''}
                // 右クリックでのメニュー展開の例
                onContextMenu={(e) => {
                  e.preventDefault()
                  handleOpen(cfg.id)(e)
                }}
              />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                <Button variant="contained" size="small" ref={anchorRefs[cfg.id]} onClick={handleToggle(cfg.id)}>
                  toggle
                </Button>
                <Button variant="outlined" size="small" onClick={handleOpen(cfg.id)}>
                  open
                </Button>
                <Button variant="outlined" size="small" onClick={controlledOpen(cfg.id)}>
                  openOnly
                </Button>
                <Button variant="outlined" size="small" onClick={handleClose(cfg.id)}>
                  close
                </Button>
                <Button variant="outlined" size="small" onClick={controlledToggle(cfg.id)}>
                  toggleOnly
                </Button>
              </Box>

              {/* この位置でレンダラーを置いておく */}
              <ContextMenu {...registers[cfg.id]} open={opens[cfg.id]} positionStyle={positionStyles[cfg.id]} />
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
