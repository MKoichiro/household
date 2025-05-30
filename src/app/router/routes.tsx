// NOTE: element -> Component, errorElement -> ErrorBoundaryとする方がより新しい書き方らしいが、機能的には変わらない。
// ComponentTypeでの指定になるため、特にelementをComponentにするにはエンハンサーも編集が必要。保留。
// see: https://reactrouter.com/start/changelog#componenterrorboundary-route-properties

import { Navigate, createBrowserRouter } from 'react-router-dom'

import LayoutFallback from '@ui/fallback/LayoutFallback'
import PageFallback from '@ui/fallback/PageFallback'

import { layouts, pages } from './elements'

const router = createBrowserRouter([
  // 公開ページのルート。パスレスルートのネストで、レイアウトとフォールバックを設定している。
  {
    path: undefined,
    element: layouts.public.root,
    errorElement: <LayoutFallback />,
    children: [
      {
        path: undefined,
        errorElement: <PageFallback />,
        children: [
          { path: '/', element: pages.public.index },
          { path: '*', element: pages.others.notFound },
        ],
      },
    ],
  },

  // 認証済みユーザーがアクセスするアプリケーション本体のルート。
  {
    path: '/app',
    element: layouts.app.root,
    errorElement: <LayoutFallback />,
    children: [
      {
        errorElement: <PageFallback />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: 'home', element: pages.app.home },
          { path: 'report', element: pages.app.report },
          {
            path: 'settings',
            element: layouts.app.settings.root,
            children: [
              { index: true, element: <Navigate to="basic" replace /> },
              { path: 'basic', element: pages.app.settings.basic },
              { path: 'security', element: pages.app.settings.security },
            ],
          },
          { path: 'news', element: pages.app.news },
        ],
      },
    ],
  },

  // 認証時にアクセスする認証関連のルート。ログイン/サインアップページなど。
  {
    path: '/auth',
    element: layouts.auth.root,
    errorElement: <LayoutFallback />,
    children: [
      {
        errorElement: <PageFallback />,
        children: [
          { index: true, element: <Navigate to="login" replace /> },
          { path: 'login', element: pages.auth.login },
          { path: 'signup', element: pages.auth.signup },
        ],
      },
    ],
  },

  // メール認証時、サインアップ後の自動リダイレクト先のルート。
  {
    path: '/verify-email',
    errorElement: <LayoutFallback />,
    element: layouts.emailVerification.root,
    children: [{ index: true, element: pages.emailVerification.index, errorElement: <PageFallback /> }],
  },

  // 開発用のルート。ガードにより dev 環境以外ではアクセス不可。
  {
    path: '/dev',
    element: layouts.dev.root,
    errorElement: <LayoutFallback />,
    children: [
      {
        errorElement: <PageFallback />,
        children: [
          { index: true, element: <Navigate to="component-test" replace /> },
          { path: 'component-test', element: pages.dev.canvas1 },
        ],
      },
    ],
  },
])

export default router
