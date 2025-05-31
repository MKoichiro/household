import styled from '@emotion/styled'
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from '@mui/material'
import { httpsCallable } from 'firebase/functions'
import { useState } from 'react'

import { functions } from '@app/configs/firebase'
import { AutoAwesomeIcon, ExpandMoreIcon, LightbulbOutlineIcon } from '@icons/index'
import { useAccordion } from '@shared/hooks/useAccordion'
import type { Transaction } from '@shared/types'
import {
  calculateCategorySummaries,
  calculateDailySummaries,
  financeCalculations,
} from '@shared/utils/financeCalculations'
import { BareAccordionContent, BareAccordionHead } from '@ui/Accordion'

interface GenerateResponseData {
  prompt: string
}

interface GenerateResponseResult {
  text: string
}

interface AIAdvisorProps {
  monthlyTransactions: Transaction[]
}

const AIAdvisor = ({ monthlyTransactions }: AIAdvisorProps) => {
  const { contentRef, isOpen, contentHeight, toggle, open, close } = useAccordion(false)

  // AI に渡すデータは計算しておく
  const MonthlySummary = financeCalculations(monthlyTransactions)
  const dailySummaries = calculateDailySummaries(monthlyTransactions)
  const categorySummaries = calculateCategorySummaries(monthlyTransactions)
  const prompt = `
    あなたはファイナンシャルアドバイザーです。
    以下に個人の月間収支の情報を示します。月次レポートを作成してください。
    - 月次収支データ:
    \`\`\`json
      ${JSON.stringify(MonthlySummary)}
    \`\`\`
    - 日別収支データ:
    \`\`\`json
      ${JSON.stringify(dailySummaries)}
    \`\`\`
    - カテゴリ毎の収支データ:
    \`\`\`json
      ${JSON.stringify(categorySummaries)}
    \`\`\`
    - 必ず日本語で書いてください。
    - マークダウンではなく、プレーンテキストで出力してください。
    - 専門用語を使わず、一般の人にもわかりやすく書いてください。
    - 箇条書きは避けてください。
    - 事実を述べるだけでなく、消費活動の潜在的な傾向を指摘しつつ、アドバイスや提案も含めてください。
  `
  console.log('AIAdvisor prompt:', prompt)
  const [result, setResult] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  // Firebase Functions の httpsCallable を使って関数を呼び出す
  const generateResponseCallable = httpsCallable<GenerateResponseData, GenerateResponseResult>(
    functions,
    'generateResponse'
  )

  const handleGenerate = async () => {
    console.log('Generating response for prompt:', prompt)
    if (!prompt) {
      console.warn('Prompt is empty, skipping function call')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // prompt を渡して関数を呼び出し
      const response = await generateResponseCallable({ prompt })
      // 返却された text をステートにセット
      setResult(response.data.text)
      open() // アコーディオンを開く
    } catch (e: unknown) {
      console.error('Error calling function:', e)
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  console.log(isOpen)

  return (
    <Box sx={{ border: '1px solid #999', borderRadius: '1.6rem' }}>
      <AccordionHead open={isOpen} component="div">
        <Stack direction="row" alignItems="center" gap={1}>
          <LightbulbOutlineIcon />
          <Typography variant="subtitle1" className="ai-advisor__header-txt">
            AIアドバイザー
          </Typography>
        </Stack>
        {loading ? (
          <CircularProgress size={16} />
        ) : result ? (
          <ToggleButton $open={isOpen} onClick={toggle} disabled={loading}>
            <ExpandMoreIcon />
          </ToggleButton>
        ) : (
          <Button onClick={() => void handleGenerate()} disabled={loading || !prompt} startIcon={<AutoAwesomeIcon />}>
            聞いてみる
          </Button>
        )}
      </AccordionHead>
      <AccordionContent ref={contentRef} $open={isOpen} $height={contentHeight}>
        <div className="ai-advisor__accordion-content-inner">
          <Typography variant="subtitle2">AIの回答</Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {result}
          </Typography>
        </div>
      </AccordionContent>
    </Box>
  )
}

const AccordionHead = styled(BareAccordionHead)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem 1.6rem;
`
const AccordionContent = styled(BareAccordionContent)<{ $open: boolean; $height: number }>`
  overflow: hidden;
  height: ${({ $open, $height }) => ($open ? `${$height}px` : '0')};
  transition: height 300ms ease;
  .ai-advisor__accordion-content-inner {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
`

const ToggleButton = styled(IconButton)<{ $open: boolean }>`
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0)')};
  transition: transform 300ms ease;
`

export default AIAdvisor
