import styled from '@emotion/styled'
import { Button, Typography } from '@mui/material'
import { format } from 'date-fns'

import { AddCircleIcon, ExpandMoreIcon } from '@icons/index'
import { useAccordion } from '@shared/hooks/useAccordion'
import { useTransaction } from '@shared/hooks/useContexts'
import type { TransactionFormValues } from '@shared/types'
import { BareAccordionContent, BareAccordionHead } from '@ui/Accordion'

const targetMonth = format(new Date(), 'yyyy-MM')
// const targetMonth = '2025-01'
const TRANSACTIONS: TransactionFormValues[] = [
  {
    amount: '1000',
    type: 'expense',
    date: `${targetMonth}-02`,
    category: '食費',
    content: 'ランチ代、ラーメン',
  },
  {
    amount: '3000',
    type: 'income',
    date: `${targetMonth}-03`,
    category: '副収入',
    content: 'アルバイト',
  },
  {
    amount: '1800',
    type: 'expense',
    date: `${targetMonth}-04`,
    category: '娯楽',
    content: '映画鑑賞、「街の上で」',
  },
  {
    amount: '80000',
    type: 'income',
    date: `${targetMonth}-01`,
    category: 'お小遣い',
    content: '両親からのお小遣い',
  },
  {
    amount: '120000',
    type: 'income',
    date: `${targetMonth}-05`,
    category: '副収入',
    content: 'フリマアプリ売上',
  },
  {
    amount: '300000',
    type: 'income',
    date: `${targetMonth}-25`,
    category: '給与',
    content: '月末給料',
  },
  {
    amount: '4500',
    type: 'expense',
    date: `${targetMonth}-02`,
    category: '食費',
    content: 'ランチ代（弁当購入）',
  },
  {
    amount: '3800',
    type: 'expense',
    date: `${targetMonth}-04`,
    category: '食費',
    content: 'ディナー（外食）',
  },
  {
    amount: '6000',
    type: 'expense',
    date: `${targetMonth}-03`,
    category: '交際費',
    content: '友人との飲み会',
  },
  {
    amount: '1500',
    type: 'expense',
    date: `${targetMonth}-06`,
    category: '日用品',
    content: 'トイレットペーパー購入',
  },
  {
    amount: '2500',
    type: 'expense',
    date: `${targetMonth}-08`,
    category: '日用品',
    content: '洗剤とスポンジ',
  },
  {
    amount: '80000',
    type: 'expense',
    date: `${targetMonth}-01`,
    category: '住居費',
    content: '家賃支払い',
  },
  {
    amount: '5000',
    type: 'expense',
    date: `${targetMonth}-10`,
    category: '娯楽',
    content: '映画鑑賞（ポップコーン付き）',
  },
  {
    amount: '2300',
    type: 'expense',
    date: `${targetMonth}-07`,
    category: '交通費',
    content: '電車通勤（定期外エリア分）',
  },
  {
    amount: '1800',
    type: 'expense',
    date: `${targetMonth}-12`,
    category: '娯楽',
    content: 'ゲームアプリ内課金',
  },
  {
    amount: '7500',
    type: 'expense',
    date: `${targetMonth}-09`,
    category: '交際費',
    content: 'カフェでのお茶代',
  },
  {
    amount: '9000',
    type: 'expense',
    date: `${targetMonth}-14`,
    category: '交通費',
    content: '高速バス往復',
  },
  {
    amount: '3400',
    type: 'expense',
    date: `${targetMonth}-16`,
    category: '食費',
    content: 'スーパーで食材まとめ買い',
  },
  {
    amount: '2200',
    type: 'income',
    date: `${targetMonth}-18`,
    category: '副収入',
    content: 'ポイント還元',
  },
  {
    amount: '1200',
    type: 'expense',
    date: `${targetMonth}-20`,
    category: '日用品',
    content: '歯ブラシと歯磨き粉',
  },
  {
    amount: '1100',
    type: 'expense',
    date: `${targetMonth}-22`,
    category: '交通費',
    content: 'バス定期券補充',
  },
  {
    amount: '6500',
    type: 'expense',
    date: `${targetMonth}-23`,
    category: '娯楽',
    content: 'カラオケ3時間パック',
  },
  {
    amount: '80000',
    type: 'income',
    date: `${targetMonth}-01`,
    category: 'お小遣い',
    content: '両親からのお小遣い',
  },
  {
    amount: '4500',
    type: 'expense',
    date: `${targetMonth}-01`,
    category: '食費',
    content: 'コンビニで朝食',
  },
  {
    amount: '120000',
    type: 'income',
    date: `${targetMonth}-02`,
    category: '副収入',
    content: 'フリマアプリ売上',
  },
  {
    amount: '1500',
    type: 'expense',
    date: `${targetMonth}-02`,
    category: '日用品',
    content: 'トイレットペーパー購入',
  },
  {
    amount: '5000',
    type: 'expense',
    date: `${targetMonth}-03`,
    category: '娯楽',
    content: '映画鑑賞',
  },
  {
    amount: '3000',
    type: 'expense',
    date: `${targetMonth}-03`,
    category: '食費',
    content: 'ランチ（ラーメン）',
  },
  {
    amount: '13000',
    type: 'income',
    date: `${targetMonth}-05`,
    category: '副収入',
    content: 'アンケートモニター当選',
  },
  {
    amount: '6000',
    type: 'expense',
    date: `${targetMonth}-05`,
    category: '交際費',
    content: '飲み会費用',
  },
  {
    amount: '2500',
    type: 'expense',
    date: `${targetMonth}-06`,
    category: '日用品',
    content: '洗剤とスポンジ',
  },
  {
    amount: '5900',
    type: 'expense',
    date: `${targetMonth}-06`,
    category: '住居費',
    content: 'ガス代支払い',
  },
  {
    amount: '2300',
    type: 'expense',
    date: `${targetMonth}-07`,
    category: '交通費',
    content: '電車通勤定期外',
  },
  {
    amount: '3400',
    type: 'expense',
    date: `${targetMonth}-08`,
    category: '食費',
    content: 'スーパーで夕食材料',
  },
  {
    amount: '9000',
    type: 'expense',
    date: `${targetMonth}-10`,
    category: '交通費',
    content: '高速バス往復',
  },
  {
    amount: '7500',
    type: 'expense',
    date: `${targetMonth}-10`,
    category: '交際費',
    content: 'カフェでお茶',
  },
  {
    amount: '1200',
    type: 'expense',
    date: `${targetMonth}-12`,
    category: '食費',
    content: '弁当購入',
  },
  {
    amount: '1100',
    type: 'expense',
    date: `${targetMonth}-14`,
    category: '交通費',
    content: 'バス定期補充',
  },
  {
    amount: '2200',
    type: 'income',
    date: `${targetMonth}-18`,
    category: '副収入',
    content: 'ポイント還元',
  },
  {
    amount: '1200',
    type: 'expense',
    date: `${targetMonth}-20`,
    category: '日用品',
    content: '歯ブラシと歯磨き粉',
  },
  {
    amount: '6500',
    type: 'expense',
    date: `${targetMonth}-20`,
    category: '娯楽',
    content: 'カラオケ3時間パック',
  },
  // ここから追加の9件
  {
    amount: '2300',
    type: 'expense',
    date: `${targetMonth}-11`,
    category: '住居費',
    content: 'インターネット代支払い',
  },
  {
    amount: '12000',
    type: 'expense',
    date: `${targetMonth}-13`,
    category: '娯楽',
    content: 'ライブチケット購入',
  },
  {
    amount: '5000',
    type: 'income',
    date: `${targetMonth}-15`,
    category: '副収入',
    content: 'ブログ広告収入',
  },
  {
    amount: '1800',
    type: 'expense',
    date: `${targetMonth}-17`,
    category: '交通費',
    content: 'タクシー代',
  },
  {
    amount: '1300',
    type: 'expense',
    date: `${targetMonth}-19`,
    category: '日用品',
    content: 'シャンプー購入',
  },
  {
    amount: '50000',
    type: 'income',
    date: `${targetMonth}-21`,
    category: 'お小遣い',
    content: '祖父母からのお小遣い',
  },
  {
    amount: '8000',
    type: 'expense',
    date: `${targetMonth}-24`,
    category: '交際費',
    content: '誕生日プレゼント',
  },
  {
    amount: '4500',
    type: 'expense',
    date: `${targetMonth}-26`,
    category: '食費',
    content: '宅配寿司',
  },
  {
    amount: '22000',
    type: 'income',
    date: `${targetMonth}-27`,
    category: '副収入',
    content: 'フリーランス仕事',
  },
]

const BulkInsert = () => {
  const { isOpen, contentRef, contentHeight, toggle } = useAccordion(false)
  const { handleAddTransactions } = useTransaction()
  const handleBulkInsert = () => {
    // ここでバルクインサートの処理を実装
    // 例えば、APIを呼び出してTRANSACTIONSを送信するなど
    console.log('バルクインサート:', TRANSACTIONS)
    void handleAddTransactions(TRANSACTIONS)
  }
  return (
    <BulkInsertRoot>
      <AccordionHead open={isOpen} component="button" onClick={toggle}>
        開発者ツール
        <ExpandMoreIcon />
      </AccordionHead>
      <AccordionContent ref={contentRef} $open={isOpen} $height={contentHeight}>
        <Typography variant="body2" sx={{ p: 2 }}>
          下のボタンで今月に対してテストデータをバルクインサートできます。
        </Typography>
        <Button endIcon={<AddCircleIcon />} onClick={handleBulkInsert} variant="contained" color="primary">
          バルクインサート（５０件）
        </Button>
        <Typography variant="body2" sx={{ p: 2 }}>
          削除する時は、「月間レポート」画面下部のテーブルからすべて選択して一括削除できます。
        </Typography>
      </AccordionContent>
    </BulkInsertRoot>
  )
}

const BulkInsertRoot = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.palette.app.lighterBg.level2.bg[theme.palette.mode]};
  color: ${({ theme }) => theme.palette.app.lighterBg.level2.contrastText[theme.palette.mode]};
  margin-top: 16px;
  border-radius: 8px;
`

const AccordionHead = styled(BareAccordionHead)<{ open: boolean }>`
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  svg {
    display: block;
    ${({ open }) => (open ? 'transform: rotate(180deg);' : '')};
    transition: transform 300ms ease;
  }
`

const AccordionContent = styled(BareAccordionContent, {
  shouldForwardProp: (prop) => !['$open', '$height'].includes(prop),
})<{ $open: boolean; $height: number }>`
  height: ${({ $open, $height }) => ($open ? `${$height}px` : '0')};
  overflow: hidden;
  transition: height 300ms ease;
`

export default BulkInsert
