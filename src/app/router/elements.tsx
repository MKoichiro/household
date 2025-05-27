// NOTE: 冗長に感じる場合はroutes.tsxのelementディレクティブに直接指定することも可能。好み。

import { lazy } from 'react'

import AppProvider from '@app/providers/AppProvider'
import TransactionProvider from '@app/providers/TransactionProvider'
import AuthedLayout from '@components/layouts/AuthedLayout/AuthedLayout'
import SettingsLayout from '@components/layouts/AuthedLayout/SettingsLayout'
import LandingLayout from '@components/layouts/LandingLayout'
import NonAuthedLayout from '@components/layouts/NonAuthedLayout'
import * as Dev from '@dev'
import Landing from '@pages/Landing'
import Login from '@pages/Login'
import NotFound from '@pages/NotFound'
import PrivateNews from '@pages/PrivateNews'
import Security from '@pages/Security'
import Settings from '@pages/Settings'
import SignUp from '@pages/Signup'
import VerifyEmail from '@pages/VerifyEmail'

import { createLayout, createPage } from './enhancers'

// 比較的大きなコンポーネントは、React.lazyで遅延読み込み
const Home = lazy(() => import('../../pages/HomeContainer'))
const Report = lazy(() => import('../../pages/ReportContainer'))

const layouts = {
  public: {
    root: createLayout(<LandingLayout />, { guards: ['CheckAuth'] }),
  },
  app: {
    root: createLayout(<AuthedLayout />, {
      guards: ['RequireAuth', 'RequireEmailVerification'],
      providers: [AppProvider, TransactionProvider],
    }),
    settings: {
      root: createLayout(<SettingsLayout />),
    },
  },
  auth: {
    root: createLayout(<NonAuthedLayout />, { guards: ['CheckAuth'] }),
  },
  emailVerification: {
    root: createLayout(<NonAuthedLayout />, { guards: ['CheckAuth', 'RequireAuth'] }),
  },
  dev: {
    root: createLayout(<NonAuthedLayout />, { guards: [] }),
  },
}

const pages = {
  public: {
    index: createPage(<Landing />, { meta: { title: { noBody: true } } }),
  },
  app: {
    index: undefined,
    home: createPage(<Home />, { meta: { title: { body: 'ホーム' } } }),
    report: createPage(<Report />, { meta: { title: { body: '月間レポート' } } }),
    settings: {
      index: undefined,
      basic: createPage(<Settings />, { meta: { title: { body: '基本情報' } } }),
      security: createPage(<Security />, { meta: { title: { body: 'セキュリティ' } } }),
    },
    news: createPage(<PrivateNews />, { meta: { title: { body: 'お知らせ' } } }),
  },
  auth: {
    index: undefined,
    login: createPage(<Login />, { meta: { title: { body: 'ログイン' } } }),
    signup: createPage(<SignUp />, { meta: { title: { body: 'サインアップ' } } }),
  },
  emailVerification: {
    index: createPage(<VerifyEmail />, { meta: { title: { body: 'メール確認' } } }),
  },
  dev: {
    index: undefined,
    canvas1: createPage(<Dev.HeaderModalMenu />, { meta: { title: { body: '開発者専用ページ' } } }),
  },
  others: {
    notFound: createPage(<NotFound />, { meta: { title: { body: '404 Not Found' } } }),
  },
}

export { layouts, pages }
