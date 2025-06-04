import type { Transaction } from '@shared/types'
import {
  calculateCategorySummaries,
  calculateDailySummaries,
  financeCalculations,
} from '@shared/utils/financeCalculations'

export const createPrompt = (
  monthlyTransactions: Transaction[],
  prevMonthlyTransactions: Transaction[],
  userName: string | null | undefined,
  targetYear: string,
  targetMonth: string
) => {
  const MonthlySummary = JSON.stringify(financeCalculations(monthlyTransactions))
  const dailySummaries = JSON.stringify(calculateDailySummaries(monthlyTransactions))
  const categorySummaries = JSON.stringify(calculateCategorySummaries(monthlyTransactions))
  const prevMonthlySummary = JSON.stringify(financeCalculations(prevMonthlyTransactions))
  const prevCategorySummaries = JSON.stringify(calculateCategorySummaries(prevMonthlyTransactions))
  const prompt = `
# 指示
以下にユーザー名、"${userName}" さんの収支の情報を示します。

## 【月次収支データ】
  ${MonthlySummary}
## 【日別収支データ】
  ${dailySummaries}
## 【カテゴリ別の収支データ】
  ${categorySummaries}
## 【前月の月次収支データ】
  ${prevMonthlySummary}
## 【前月のカテゴリ別の収支データ】
  ${prevCategorySummaries}

${targetYear}年${targetMonth}月の月次レポートを作成してください。

# 条件
## 出力の形式
- 以下の三段落構成で出力してください。ここでは便宜上「総括」、「傾向分析結果」「アドバイス」と表現しますが、出力時には段落の見出しは付けないでください。
  1. 「総括」（～100 文字）
    【月次収支データ】を参照し、今月の収支を簡潔にまとめ、全体として黒字か赤字かを示してください。
  2. 「傾向分析結果」（200 ～ 400 文字）
    - 【月次収支データ】、【日別収支データ】、【カテゴリ別の収支データ】、【前月の月次収支データ】、【前月のカテゴリ別の収支データ】を参照し、以下の点を含めてください。
    - 支出の多かったカテゴリやピーク日
    - 収入と支出のバランスが崩れたタイミング
    - 前月との比較
  3. 「アドバイス」（200 ～ 300 文字）
    - 上記の傾向を踏まえて、次の月または今月の残りの期間に向けた改善策や節約のコツを具体的に提案してください。

## 注意点
- 出力は必ず日本語にしてください。
- 現在日時を考慮し、月次レポートの作成時期に応じて適切な内容を出力してください。
  月の初めや中旬であれば、収入や支出のデータがまだ完全ではない場合があります。
- 専門用語を使わず、一般の人にもわかりやすい文章で出力してください。
- マークダウン形式の記述は使用しないでください。（NG例: "-"や数字による箇条書き、"---"による区切り線、"**"による太字など）
- 数値の前後には半角スペースを入れてください。（OK例: "合計で 1,000 円"、"から 5 月 2 日の間に..."）
- 追加のプロンプトを促す文言は使用しないでください。（NG例: 「もし費目ごとの支出内訳の見直しや節約方法について知りたいことがあれば、いつでもご相談ください。」）
- 「○○するようにしてください」などの強制する表現は避けてください。代わりに「○○することをおすすめします」などの提案の形で出力してください。

## 例
以下は、各段落の実際の出力例です。参考にしてください。
1. 「総括」
  - 5 月は収入が 300,000 円、支出が 250,000 円で、合計で + 50,000 円の黒字でした。
  - <ユーザー名> さんの 5 月の収支は、収入が 300,000 円、支出が 250,000 円で、合計で + 50,000 円の黒字となっています。
  - 今月はまだ中旬ですが、収入は 300,000 円、支出が 250,000 円で、合計で + 50,000 円の黒字となっています。
  - 今月は始まったばかりですね。収入のデータはありませんが、支出は 250,000 円で、合計で - 250,000 円の赤字となっています。
2. 「傾向分析結果」
  - 食費カテゴリの支出が 90,000 円と全体の約 30% を占めており、特に 15 日に映画館や外食が続きました。
  - 日別では 5 月 10 日に急激に支出が跳ね上がり、1 回の買い物で 15,000 円を使っています。
  - 収入はボーナスが入った 5 月 1 日を除けば概ね一定ですが、5 月 20 日に副業サイトで 10,000 円が入金されています。
  - 前月と比較すると、食費が 20% 増加しており、特に外食が多かったことが影響しています。
  - なお、前月にはデータが登録されていないようです。追加していただければ、傾向を比較することができます。
3. 「アドバイス」
  - 食費の支出が高いので、外食を減らし、週に 1 回のまとめ買いをおすすめします。
`
  return prompt
}
