import styled from '@emotion/styled'
import { alpha, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { format } from 'date-fns'
import { httpsCallable } from 'firebase/functions'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { functions } from '@app/configs/firebase'
import { AutoAwesomeIcon, AutoModeIcon, ExpandMoreIcon, HistoryIcon, TipsAndUpdatesIcon } from '@icons/index'
import { useAccordion } from '@shared/hooks/useAccordion'
import { useRemToPx } from '@shared/hooks/useRemToPx'
import type { Transaction } from '@shared/types'
import { BareAccordionContent, BareAccordionHead } from '@ui/Accordion'

import { createPrompt } from './createPrompt'
import NoDataError from './NoDataError'

const STORAGE_KEY_PREFIX = 'aiAdvisorResult'

interface GenerateResponseData {
  prompt: string
}

interface GenerateResponseResult {
  text: string
}

interface AIAdvisorProps {
  monthlyTransactions: Transaction[]
  reportMonth: Date
}

interface AIResult {
  text: string
  createdAt: Date | null
}

const AIAdvisor = ({ monthlyTransactions, reportMonth }: AIAdvisorProps) => {
  const { contentRef, isOpen, contentHeight, toggle, open, close } = useAccordion(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const { remToPx } = useRemToPx()

  const initialResult: AIResult = { text: '', createdAt: null }
  const [result, setResult] = useState<AIResult>(initialResult)
  const [error, setError] = useState<ReactNode | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // AI に渡すプロンプトを用意
  // 内部のデータ数に応じてデータ整形の計算量が増えるのでメモ化
  const prompt = useMemo(() => createPrompt(monthlyTransactions), [monthlyTransactions])

  // 月ごとに、生成結果を保持しておくためのローカルストレージのキー
  const storageKey = `${STORAGE_KEY_PREFIX}_${format(reportMonth, 'yyyy-MM')}`

  // NOTE: 結局、月を切り替えるときの処理なので、すべて親コンポーネントに外部化すれば、useEffect 不要で MonthSelector のハンドラに組み込める。
  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const restored = JSON.parse(saved) as AIResult
      setResult(restored)
    } else {
      initialize()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportMonth])

  // ハンドラー
  const handleAsk = () => void generate()

  const handleRetry = () => {
    if (headerRef.current) {
      // スクロール位置をページトップへ
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
    }
    initialize()
    void generate()
  }

  // ヘルパー
  // httpsCallable で Firebase Functions サーバーに関数(生成処理)の代理実行をディスパッチ
  const generateAIResponseCallable = httpsCallable<GenerateResponseData, GenerateResponseResult>(
    functions,
    'generateAIResponse'
  )

  const initialize = () => {
    setResult(initialResult)
    setError(null)
    setLoading(false)
    close()
  }

  const generate = async () => {
    if (monthlyTransactions.length === 0) {
      setError(<NoDataError />)
      open()
      return
    }
    setError(null)
    setLoading(true)
    try {
      const response = await generateAIResponseCallable({ prompt })
      const formatted = response.data.text.trim() // 先頭と末尾のホワイトスペースを削除
      const payload = { text: formatted, createdAt: new Date() }
      localStorage.setItem(storageKey, JSON.stringify(payload)) // ローカルストレージに保存
      setResult(payload)
    } catch (e: unknown) {
      console.error('Error calling function:', e)
      setError('サーバーエラーが発生しました。時間をおいて再度お試しください。')
    } finally {
      setLoading(false)
      open()
    }
  }

  return (
    <AIAdvisorRoot $loading={loading} ref={headerRef}>
      <AccordionHead id="ai-advisor-header" open={isOpen} component="div">
        <Stack direction="row" alignItems="center" sx={{ gap: '0.8rem' }}>
          <TipsAndUpdatesIcon />
          <Typography variant="subtitle1" className="ai-advisor__header-txt">
            AI アドバイザー
          </Typography>
        </Stack>

        {/* ヘッダー右端コンテンツ */}
        {loading ? (
          <Stack direction="row" alignItems="center" sx={{ gap: '1.6rem' }}>
            <CircularProgress size={remToPx(1.6)} />
            <Typography className="ai-advisor__btn-txt" color="primary">
              生成中...
            </Typography>
          </Stack>
        ) : result.text || error ? (
          <ToggleButton
            className="ai-advisor__btn-txt"
            $open={isOpen}
            onClick={toggle}
            disabled={loading}
            endIcon={<ExpandMoreIcon />}
          >
            AI の提案
          </ToggleButton>
        ) : (
          <Button
            className="ai-advisor__btn-txt"
            onClick={handleAsk}
            disabled={loading || !prompt}
            startIcon={<AutoAwesomeIcon />}
          >
            聞いてみる
          </Button>
        )}
      </AccordionHead>

      <AccordionContent ref={contentRef} $open={isOpen} $height={contentHeight}>
        <ResultContainer variant="body1" $open={isOpen}>
          {error ? error : result.text}
        </ResultContainer>
        {result.createdAt && (
          <TimeStamp variant="caption">
            <HistoryIcon />
            {format(result.createdAt, 'yyyy/M/d, HH:mm')}
          </TimeStamp>
        )}

        <Button
          className="ai-advisor__btn-txt"
          onClick={handleRetry}
          aria-label="もう一度試す"
          endIcon={<AutoModeIcon />}
          sx={{ display: 'flex', alignItems: 'center', ml: 'auto', mr: '1.6rem', mb: '1.6rem' }}
        >
          もう一度試す
        </Button>
      </AccordionContent>
    </AIAdvisorRoot>
  )
}

const AIAdvisorRoot = styled(Box, { shouldForwardProp: (prop) => prop !== '$loading' })<{ $loading: boolean }>`
  border-radius: 1.6rem;
  border: 0.2rem solid transparent;
  background: ${({ theme }) => `
    linear-gradient(${theme.palette.ui.aiAdvisor.bg[theme.palette.mode]}, ${theme.palette.ui.aiAdvisor.bg[theme.palette.mode]}) padding-box,
    linear-gradient(to bottom right, ${theme.palette.ui.aiAdvisor.gradations.start[theme.palette.mode]}, ${theme.palette.ui.aiAdvisor.gradations.end[theme.palette.mode]}) border-box;
  `};
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows[2]};

  .ai-advisor__btn-txt {
    font-size: 1.5rem;
  }

  /* 生成中に表示するスケルトンスクリーン */
  &::before {
    display: ${({ $loading }) => ($loading ? 'block' : 'none')};
    position: absolute;
    inset: 0;
    width: 300%;
    z-index: 2;
    content: '';
    background-image: ${({ theme }) => `
      linear-gradient(
        140deg,
        ${alpha(theme.palette.ui.aiAdvisor.gradations.start[theme.palette.mode], 0)},
        ${alpha(theme.palette.ui.aiAdvisor.gradations.start[theme.palette.mode], 0.3)},
        ${alpha(theme.palette.ui.aiAdvisor.gradations.end[theme.palette.mode], 0.3)},
        ${alpha(theme.palette.ui.aiAdvisor.gradations.end[theme.palette.mode], 0)}
      )
    `};
    animation: ${({ $loading }) => ($loading ? 'skelton_flash' : 'none')} 2.5s linear infinite;
    will-change: animation;
  }

  @keyframes skelton_flash {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
`

const AccordionHead = styled(BareAccordionHead)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.6rem;
  height: 3.2em;
`
const AccordionContent = styled(BareAccordionContent, {
  shouldForwardProp: (prop) => prop !== '$open' && prop !== '$height',
})<{
  $open: boolean
  $height: number
}>`
  overflow: hidden;
  height: ${({ $open, $height }) => ($open ? `${$height}px` : '0')};
  transition: height 300ms ease;
`

const ResultContainer = styled(Typography, { shouldForwardProp: (prop) => prop !== '$open' })<{ $open: boolean }>`
  white-space: pre-wrap;
  overflow-x: auto;
  margin: 0 1.6rem 1.6rem;

  /* 区切り線 */
  &::before {
    content: '';
    display: block;
    width: 100%;
    height: 0.2rem;
    border-radius: 0.1rem;
    margin-bottom: 1.6rem;
    background: ${({ theme }) => `
      linear-gradient(
        to left,
        ${theme.palette.ui.aiAdvisor.gradations.start[theme.palette.mode]},
        ${theme.palette.ui.aiAdvisor.gradations.end[theme.palette.mode]}
      )
    `};
    transform: ${({ $open }) => ($open ? 'translateX(0)' : 'translateX(-100%)')};
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    transition:
      transform 500ms ease 300ms,
      opacity 500ms ease 300ms;
  }
`

const ToggleButton = styled(Button, { shouldForwardProp: (prop) => prop !== '$open' })<{ $open: boolean }>`
  display: flex;
  align-items: center;
  svg {
    display: block;
    transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
    transition: transform 300ms ease;
  }
`

const TimeStamp = styled(Typography)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 0.4rem;
  margin: 0 1.6rem 1.6rem;
  color: ${({ theme }) => theme.palette.text.secondary};
`

export default AIAdvisor
