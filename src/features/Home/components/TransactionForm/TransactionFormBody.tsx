import { Box, Button, IconButton, Stack, Typography } from '@mui/material'
import { ControllerRenderProps, useFormContext } from 'react-hook-form'
import { Transaction, TransactionFormValues, TransactionType } from '../../../../shared/types'
import { FormEvent } from 'react'
import * as F from './fields'
import { CloseIcon } from '../../../../icons'

interface TransactionFormBodyProps {
  selectedTransaction: Transaction | null
  isFormOpen: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onAmountBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
  onTypeClick: (type: TransactionType) => () => void
  onDeleteClick: () => void
  onCloseClick: () => void
}

const TransactionFormBody = ({
  onCloseClick: handleCloseClick,
  onSubmit: handleSubmit,
  onAmountBlur: handleAmountBlur,
  onTypeClick: handleTypeClick,
  onDeleteClick: handleDeleteClick,
  selectedTransaction,
}: TransactionFormBodyProps) => {
  const {
    formState: { errors, isDirty, isValid },
    control,
    watch,
  } = useFormContext<TransactionFormValues>()
  const currentType: TransactionType = watch('type') // 現在の収益タイプを監視
  const isNewEntry = selectedTransaction === null // 新規エントリーかどうか

  return (
    <Stack spacing={3}>
      {/* 入力エリアヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="subtitle1"
          sx={{ color: (theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode] }}
        >
          {isNewEntry ? '内訳を追加' : '内訳を編集'}
        </Typography>
        <IconButton
          sx={{ color: (theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode] }}
          onClick={handleCloseClick}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* フォーム */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2} useFlexGap>
          {/* F: フィールド部分 */}
          <F.Type control={control} onClick={handleTypeClick} />
          <F.Date control={control} errors={errors} />
          <F.Category control={control} errors={errors} currentType={currentType} />
          <F.Amount control={control} errors={errors} onBlur={handleAmountBlur} />
          <F.Content control={control} errors={errors} />

          {/* 保存/更新ボタン・削除ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === 'income' ? 'primary' : 'error'}
            disabled={!isDirty || !isValid}
            fullWidth
            sx={{
              marginTop: (theme) => theme.spacing(3),
            }}
          >
            {isNewEntry ? '保存' : '更新'}
          </Button>
          {selectedTransaction && (
            <Button variant="outlined" color="secondary" onClick={handleDeleteClick} fullWidth>
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </Stack>
  )
}

export default TransactionFormBody
