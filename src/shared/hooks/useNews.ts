import { useEffect, useRef, useState } from 'react'

import { useNotifications } from './useContexts'

// "id": 1,
// "severity": "info",
// ""priority": 1,
// "title": "New Feature Release",
// "description": {
//   "plain": "We are excited to announce the release of our new feature that enhances user experience.",
//   "html": "<u>We are excited</u> to announce the release of our <b>new feature</b> that <i>enhances user experience</i>."
// },
// "scope": "authorized' | 'public'"
// "period": {
//   "start": "2025-01-01",
//   "end": "2025-03-31"

type NewsType = {
  id: string
  severity: 'info' | 'warning' | 'error'
  priority: number
  title: string
  description: {
    plain: string
    html: string
  }
  scope: 'authorized' | 'public' // | UserGroupType （展望）
  period: {
    start: string
    end: string
  }
}

export const useNews = () => {
  const [news, setNews] = useState<NewsType[]>([])
  const [loading, setLoading] = useState(true)
  const {
    notify: {
      getNews: { ng: notifyError },
    },
  } = useNotifications()
  const didFetchRef = useRef(false)

  useEffect(() => {
    // NOTE: StrictMode 下でも一度だけ実行されるようにガード
    if (didFetchRef.current) return
    didFetchRef.current = true

    // see: ./src/public/news.json
    fetch('/news.json')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<NewsType[]>
      })
      .then((data) => {
        // 期間内のニュースのみをフィルタリングし、優先度順にソート
        const validData = data
          .filter((item) => {
            const startDate = new Date(item.period.start)
            const endDate = new Date(item.period.end)
            const now = new Date()

            // NOTE: 現状は期限のみでフィルター。将来的にはここを複雑化する。
            const judgement =
              (item.scope === 'public' || item.scope == 'authorized') && now >= startDate && now <= endDate
            return judgement
          })
          .sort((a, b) => a.priority - b.priority)
        setNews(validData)
      })
      .catch((error) => {
        notifyError()
        if (import.meta.env.DEV) console.error('news.json の読み込みに失敗:', error)
      })
      .finally(() => {
        setLoading(false)
      })

    // 初回ロード時のみの実行で良いため、ルールを無視。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { news, loading }
}
