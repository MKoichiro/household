import { ReactNode } from 'react'
import { ContextMenuConfig, MenuTree } from '../../common/ContextMenu/types'
import { PageLink } from './ContextMenuButtons'

export const createMenuTree = (logoutComponent: ReactNode): MenuTree[] => [
  {
    id: 'pages',
    display: 'ページ遷移',
    children: [
      { id: 'home', display: <PageLink to="/app/home">ホーム</PageLink> },
      { id: 'report', display: <PageLink to="/app/report">月間レポート</PageLink> },
      {
        id: 'settings',
        display: <PageLink to="/">設定</PageLink>,
        children: [
          { id: 'basic', display: <PageLink to="/app/settings/basic">ユーザー設定</PageLink> },
          { id: 'security', display: <PageLink to="/app/settings/security">アカウント設定</PageLink> },
        ],
      },
      { id: '3-1-norm-1', display: <PageLink to="/app/news">お知らせ</PageLink> },
    ],
    dividerAfter: true,
  },
  {
    id: 'logout',
    display: logoutComponent,
    includeButton: true,
  },
]

export const createMenuConfigs = (menuTree: MenuTree[]): ContextMenuConfig => ({
  id: 'header-context-menu',
  menuTree,
  autoIcon: true,
  position: {
    type: 'anchor',
    anchorRelativity: 'outerBottomRight',
    offset: { x: -8, y: 8 },
  },
  zIndex: 3000,
  closeOnClickAway: true,
})
