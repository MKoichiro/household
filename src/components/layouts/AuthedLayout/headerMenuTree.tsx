import { Link } from 'react-router-dom'
import styled from '@emotion/styled'
import { ReactNode } from 'react'
import { MenuTree } from '../../common/ContextMenu/types'

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: block;
`

export const headerMenuTree = (logoutComponent: ReactNode): MenuTree[] => [
  {
    id: 'logout',
    display: logoutComponent,
    dividerAfter: true,
  },
  {
    id: 'pages',
    display: 'ページ遷移',
    children: [
      { id: 'home', display: <StyledLink to="/app/home">ホーム</StyledLink> },
      { id: 'report', display: <StyledLink to="/app/report">月間レポート</StyledLink> },
      {
        id: 'settings',
        display: <StyledLink to="/">設定</StyledLink>,
        children: [
          { id: 'basic', display: <StyledLink to="/app/settings/basic">ユーザー設定</StyledLink> },
          { id: 'security', display: <StyledLink to="/app/settings/security">アカウント設定</StyledLink> },
        ],
      },
      { id: '3-1-norm-1', display: <StyledLink to="/app/news">お知らせ</StyledLink> },
    ],
  },
]
