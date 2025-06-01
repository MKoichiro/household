import type { Transaction } from '@shared/types'
import {
  calculateCategorySummaries,
  calculateDailySummaries,
  financeCalculations,
} from '@shared/utils/financeCalculations'

export const createPrompt = (monthlyTransactions: Transaction[]) => {
  const MonthlySummary = financeCalculations(monthlyTransactions)
  const dailySummaries = calculateDailySummaries(monthlyTransactions)
  const categorySummaries = calculateCategorySummaries(monthlyTransactions)
  const prompt = `
# 前提
あなたは家計簿アプリ（webアプリ）に組み込まれる、家計管理専門のアドバイザーです。

# 指示
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

# 条件
## 出力の形式
- 必ず日本語で書いてください。
- 専門用語を使わず、一般の人にもわかりやすく書いてください。
- マークダウン形式の記述（"-"や数字による箇条書き、"---"による区切り線、"**"による太字など）は使用禁止とします。
  代わりに段落形式のプレーンテキストで出力してください。
- 数値の前後には半角スペースを入れてください。（例: "合計で' '1,000' '円"、"から' '5' '月' '2' '日の間に..."）

## 出力の内容
- 事実を述べるだけでなく、消費活動の潜在的な傾向を指摘しつつ、アドバイスや提案も含めてください。
- このプロンプトは家計簿アプリのユーザーからは見えないことを意識して出力してください。
`
  return prompt
}
