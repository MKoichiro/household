import { RouteObject } from 'react-router-dom'
import { layouts, pages } from './elements'

const routes: RouteObject[] = [
  {
    path: '/',
    element: layouts.public.root,
    children: [
      {
        index: true,
        element: pages.public.index,
      },
      { path: '*', element: pages.others.notFound },
    ],
  },

  {
    path: '/app',
    element: layouts.app.root,
    children: [
      { path: 'home', element: pages.app.home },
      { path: 'report', element: pages.app.report },
      {
        path: 'settings',
        element: layouts.app.settings.root,
        children: [
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
      { path: 'login', element: pages.auth.login },
      { path: 'signup', element: pages.auth.signup },
      { path: '*', element: pages.others.notFound },
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
    children: [{ path: 'component-test', element: pages.dev.canvas1 }],
  },
]

export default routes
