// NOTE: 冗長に感じる場合はroutes.tsxのelementディレクティブに直接指定することも可能。好み。

import { lazy } from 'react'

import AppProvider from '@app/providers/AppProvider'
import TransactionProvider from '@app/providers/TransactionProvider'
import * as Dev from '@dev/index'
import AppLayout from '@layouts/app'
import SettingsLayout from '@layouts/app/settings/SettingsLayout'
import AuthLayout from '@layouts/auth'
import PublicLayout from '@layouts/public'
import PrivateNews from '@pages/app/PrivateNews'
import Security from '@pages/app/settings/Security'
import Settings from '@pages/app/settings/Settings'
import Login from '@pages/auth/Login'
import SignUp from '@pages/auth/Signup'
import VerifyEmail from '@pages/auth/VerifyEmail'
import NotFound from '@pages/common/NotFound'
import Landing from '@pages/public/Landing'

import { createLayout, createPage } from './enhancers'

// 比較的大きなコンポーネントは、React.lazyで遅延読み込み
const Home = lazy(() => import('../../pages/app/Home'))
const Report = lazy(() => import('../../pages/app/Report'))

// ガード付きレイアウトコンポーネントを定義。
const layouts = {
  public: {
    root: createLayout(<PublicLayout />, { guards: ['CheckAuth'] }),
  },
  app: {
    root: createLayout(<AppLayout />, {
      guards: ['RequireAuth', 'RequireEmailVerification'],
      providers: [AppProvider, TransactionProvider],
    }),
    settings: {
      root: createLayout(<SettingsLayout />),
    },
  },
  auth: {
    root: createLayout(<AuthLayout />, { guards: ['CheckAuth'] }),
  },
  emailVerification: {
    root: createLayout(<AuthLayout />, { guards: ['CheckAuth', 'RequireAuth'] }),
  },
  dev: {
    root: createLayout(<AuthLayout />, { guards: [] }),
  },
}

// メタ情報付きページコンポーネントを定義。
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
    canvas1: createPage(<Dev.OpenAIDemo />, { meta: { title: { body: '開発者専用ページ' } } }),
  },
  others: {
    notFound: createPage(<NotFound />, { meta: { title: { body: '404 Not Found' } } }),
  },
}

export { layouts, pages }
