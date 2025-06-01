import { LogoutIcon } from '@icons'
import type { ContextMenuConfig, MenuTree } from '@ui/ContextMenu/types'

import { LogoutButton, PageLink } from './ContextMenuButtons'

interface LogoutButtonVars {
  isLogoutProcessing: boolean
  logout: () => void
}

interface CreateMenuTreeArgs {
  logoutButton: LogoutButtonVars
}

export const createMenuTree = ({ logoutButton: { isLogoutProcessing, logout } }: CreateMenuTreeArgs): MenuTree[] => [
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
    display: (
      <LogoutButton
        aria-label="ログアウトボタン"
        disabled={isLogoutProcessing}
        onClick={logout}
        endIcon={<LogoutIcon />}
      >
        ログアウト
      </LogoutButton>
    ),
    includeButton: true,
  },
]

export const createMenuConfigs = (menuTree: MenuTree[]): ContextMenuConfig => ({
  id: 'header-context-menu',
  menuTree,
  autoIcon: true,
  position: {
    type: 'custom',
    customRelativity: 'windowTopLeft',
  },
  zIndex: 3000,
  closeOnClickAway: true,
})
