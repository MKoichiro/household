import { Box, Button, Card, CardActionArea, CardContent, List, ListItem, Stack, Typography } from '@mui/material'
import DailySummary from './DailySummary'
import { Transaction } from '../../../../shared/types'
import { formatCurrency } from '../../../../shared/utils/formatting'
import IconComponents from '../../../../components/common/IconComponents'
import { ReactNode } from 'react'
import { NotesIcon, AddCircleIcon } from '../../../../icons'
import { pagePadding } from '../../../../styles/constants'

interface TransactionDetailProps {
  dailyTransactions: Transaction[]
  onAddClick: () => void
  onCardClick: (transaction: Transaction) => () => void
  header: ReactNode
  ref?: (ref: HTMLElement | null) => void
}

const TransactionDetailBody = ({
  dailyTransactions,
  onAddClick: handleAddClick,
  onCardClick: handleCardClick,
  header,
  ref,
}: TransactionDetailProps) => {
  return (
    <Stack
      sx={{ height: { xs: '60dvh', lg: 'auto' }, overflowY: 'auto', overscrollBehavior: 'none', p: pagePadding, m: 0 }}
      spacing={{ xs: 3, lg: 4 }}
      ref={ref}
    >
      {/* 全体のヘッダー */}
      {header}

      {/* 収入・支出・残高 の日次合計 */}
      <DailySummary dailyTransactions={dailyTransactions} />

      {/* 内訳 */}
      <Stack spacing={1}>
        {/* ヘッダー */}
        <Stack direction="row" justifyContent="space-between">
          {/* 左側のアイコンとテキスト */}
          <Stack direction="row" alignItems="center">
            <NotesIcon sx={{ mr: 1 }} />
            <Typography
              variant="subtitle2"
              sx={{ color: (theme) => theme.palette.app.lighterBg.level2.contrastText[theme.palette.mode] }}
            >
              内訳
            </Typography>
          </Stack>
          {/* 右側の追加ボタン */}
          <Button
            aria-label="内訳追加フォームを展開するボタン"
            startIcon={<AddCircleIcon />}
            onClick={handleAddClick}
            color="primary"
            sx={{ p: 0 }}
          >
            内訳を追加
          </Button>
        </Stack>

        {/* 内訳内容部分 */}
        <Box sx={{ flexGrow: 1 }}>
          <List aria-label="取引履歴">
            <Stack spacing={1}>
              {/* 内訳マップ部分 */}
              {dailyTransactions.map((transaction) => (
                <ListItem disablePadding key={transaction.id}>
                  <Card
                    sx={{
                      width: '100%',
                      bgcolor: (theme) =>
                        transaction.type === 'income'
                          ? theme.palette.income.bg.lighter[theme.palette.mode]
                          : theme.palette.expense.bg.lighter[theme.palette.mode],
                      color: (theme) => theme.palette.app.lighterBg.level2.contrastText[theme.palette.mode],
                    }}
                  >
                    <CardActionArea onClick={handleCardClick(transaction)}>
                      <CardContent>
                        {/* useFlexGap: 子要素で margin による左右上下寄せをする場合は、内部的に gap を使うように変更
                            see: https://mui.com/material-ui/react-stack/#limitations */}
                        <Stack spacing={1} direction="row" useFlexGap>
                          {/* アイコン & カテゴリ名 */}
                          <Stack
                            spacing={0.5}
                            direction="row"
                            alignSelf="flex-start"
                            flexShrink={0}
                            sx={{
                              color: (theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode],
                            }}
                          >
                            {IconComponents[transaction.category]}
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{
                                color: (theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode],
                              }}
                            >
                              {transaction.category}
                            </Typography>
                          </Stack>

                          {/* 内容 */}
                          <Typography
                            variant="body2"
                            alignSelf="flex-start"
                            sx={{
                              color: (theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode],
                            }}
                          >
                            {transaction.content}
                          </Typography>

                          {/* 金額 */}
                          <Typography
                            textAlign="right"
                            color="text.secondary"
                            sx={{
                              ml: 'auto',
                              alignSelf: 'flex-end',
                              flexShrink: 0,
                              color: (theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode],
                              wordBreak: 'break-all',
                            }}
                          >
                            ¥{formatCurrency(transaction.amount)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Stack>
  )
}

export default TransactionDetailBody
