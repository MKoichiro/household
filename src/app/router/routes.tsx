// NOTE: ガード込みで同一レイアウトを異なるルートパスを持つページに適用するようになったら、
// ルーティングをパスのツリー構造ではなく、レイアウトのツリー構造として解釈する「パスレスルート」に移行する。
// （'/app'をundefinedにして、children側で'/app/home'と指定するようにするだけ。）

import { RouteObject, Navigate } from 'react-router-dom'
import { layouts, pages } from './elements'
// import RouteErrorFallback from '../../components/common/RoutesErrorFallback'

const routes: RouteObject[] = [
  {
    path: undefined, // 共通レイアウトを使用したいのでパスレスルート
    element: layouts.public.root,
    // NOTE: loader, actionを使う場合、発生しうるエラーを捕捉するerrorElementを設定
    // loader: async () => {},
    // errorElement: <RouteErrorFallback />,
    children: [
      { path: '/', element: pages.public.index },
      { path: '*', element: pages.others.notFound },
    ],
  },

  {
    path: '/app',
    element: layouts.app.root,
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
  {
    path: '/auth',
    element: layouts.auth.root,
    children: [
      { index: true, element: <Navigate to="login" replace /> },
      { path: 'login', element: pages.auth.login },
      { path: 'signup', element: pages.auth.signup },
    ],
  },

  {
    path: '/verify-email',
    element: layouts.emailVerification.root,
    children: [{ index: true, element: pages.emailVerification.index }],
  },

  {
    path: '/dev',
    element: layouts.dev.root,
    children: [
      { index: true, element: <Navigate to="component-test" replace /> },
      { path: 'component-test', element: pages.dev.canvas1 },
    ],
  },
]

export default routes
