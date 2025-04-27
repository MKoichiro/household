import { lazy } from 'react'
import { createLayout, createPage } from './enhancers'
import LandingLayout from '../../components/layouts/LandingLayout'
import AuthedLayout from '../../components/layouts/AuthedLayout'
import SettingsLayout from '../../components/layouts/SettingsLayout'
import NonAuthedLayout from '../../components/layouts/NonAuthedLayout'
import Landing from '../../pages/Landing'
import PrivateNews from '../../pages/PrivateNews'
import SignUp from '../../pages/Signup'
import VerifyEmail from '../../pages/VerifyEmail'
import TestAccordionSingle from '../../dev/TestAccordionSingle'
import NotFound from '../../pages/NotFound'
import Login from '../../pages/Login'
import Settings from '../../pages/Settings'
import Security from '../../pages/Security'

// 比較的大きなコンポーネントは、React.lazyで遅延読み込み
const Home = lazy(() => import('../../pages/HomeContainer'))
const Report = lazy(() => import('../../pages/ReportContainer'))

const layouts = {
  public: {
    root: createLayout(<LandingLayout />, ['CheckAuth']),
  },
  app: {
    root: createLayout(<AuthedLayout />, ['RequireAuth', 'RequireEmailVerification']),
    settings: {
      root: createLayout(<SettingsLayout />),
    },
  },
  auth: {
    root: createLayout(<NonAuthedLayout />, ['CheckAuth']),
  },
  emailVerification: {
    root: createLayout(<NonAuthedLayout />, ['CheckAuth', 'RequireAuth']),
  },
  dev: {
    root: createLayout(<NonAuthedLayout />, ['CheckDev']),
  },
}

const pages = {
  public: {
    index: createPage(<Landing />, { title: { noBody: true } }),
  },
  app: {
    index: undefined,
    home: createPage(<Home />, { title: { body: 'ホーム' } }),
    report: createPage(<Report />, { title: { body: '月間レポート' } }),
    settings: {
      index: undefined,
      basic: createPage(<Settings />, { title: { body: '基本情報' } }),
      security: createPage(<Security />, { title: { body: 'セキュリティ' } }),
    },
    news: createPage(<PrivateNews />, { title: { body: 'お知らせ' } }),
  },
  auth: {
    index: undefined,
    login: createPage(<Login />, { title: { body: 'ログイン' } }),
    signup: createPage(<SignUp />, { title: { body: 'サインアップ' } }),
  },
  emailVerification: {
    index: createPage(<VerifyEmail />, { title: { body: 'メール確認' } }),
  },
  dev: {
    index: undefined,
    canvas1: createPage(<TestAccordionSingle />, { title: { body: '開発者専用ページ' } }),
  },
  others: {
    notFound: createPage(<NotFound />, { title: { body: '404 Not Found' } }),
  },
}

export { layouts, pages }
