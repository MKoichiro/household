import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  Work,
  AddBusiness,
  Savings,
  Fastfood,
  Alarm,
  AddHome,
  Diversity3,
  SportsTennis,
  Train,
  Close,
} from '@mui/icons-material'
import { Control, Controller, ControllerRenderProps, FormState } from 'react-hook-form'
import {
  ExpenseCategory,
  IncomeCategory,
  Transaction,
  TransactionFormValues,
  TransactionType,
} from '../../../shared/types'
import { FormEvent, JSX } from 'react'
import { headerHeight, transactionMenuWidth } from '../../../shared/constants/ui'
import styled from '@emotion/styled'
import { usePortal } from '../../../shared/hooks/useContexts'
import Mask from '../../../components/common/Mask'

const StickyContext = styled.div`
  position: relative;
  width: ${transactionMenuWidth}px;
  ${({ theme }) => theme.breakpoints.down('lg')} {
    width: 0;
  }
`

const FormLaptop = styled.div<{ $isFormOpen: boolean }>`
  /* background-color: rgba(255, 0, 0, 0.3); */
  background-color: ${({ theme }) => theme.palette.background.paper};
  position: sticky;
  top: ${headerHeight}px;
  z-index: ${({ theme }) => theme.zIndex.transactionForm.lg};

  padding: 1rem;
  border-radius: 0.5rem;
  margin-top: 1rem;

  min-width: ${transactionMenuWidth}px;
  overflow-y: auto;

  pointer-events: ${({ $isFormOpen }) => ($isFormOpen ? 'auto' : 'none')};
  transform: translateX(${({ $isFormOpen }) => (!$isFormOpen ? 0 : `calc(-${2 * transactionMenuWidth}px - 0.5rem)`)});
  transition: transform 0.3s ease-in-out;
  box-shadow: ${({ theme }) => theme.shadows[4]};
  ${({ theme }) => theme.breakpoints.down('lg')} {
    display: none;
  }
`

const FormTablet = styled.div<{ $isFormOpen: boolean }>`
  /* background-color: rgba(0, 255, 0, 0.4); */
  background-color: ${({ theme }) => theme.palette.background.paper};
  position: fixed;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;

  /* 画面上下中央配置 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(${({ $isFormOpen }) => ($isFormOpen ? 1 : 0)});
  transition: transform 0.3s ease;

  width: 90vw;
  max-height: 90vh;
  z-index: ${({ theme }) => theme.zIndex.transactionForm.md};

  ${({ theme }) => theme.breakpoints.up('lg')} {
    display: none;
  }
`

const expenseCategories: { label: ExpenseCategory; icon: JSX.Element }[] = [
  { label: '食費', icon: <Fastfood /> },
  { label: '日用品', icon: <Alarm fontSize="small" /> },
  { label: '住居費', icon: <AddHome fontSize="small" /> },
  { label: '交際費', icon: <Diversity3 fontSize="small" /> },
  { label: '娯楽', icon: <SportsTennis fontSize="small" /> },
  { label: '交通費', icon: <Train fontSize="small" /> },
]

const incomeCategories: { label: IncomeCategory; icon: JSX.Element }[] = [
  { label: '給与', icon: <Work fontSize="small" /> },
  { label: '副収入', icon: <AddBusiness fontSize="small" /> },
  { label: 'お小遣い', icon: <Savings fontSize="small" /> },
]

export interface TransactionFormProps {
  // states
  selectedTransaction: Transaction | null
  isFormOpen: boolean
  // handlers
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onAmountBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
  onTypeClick: (type: TransactionType) => () => void
  onDeleteClick: () => void
  onCloseClick: () => void
  // react-hook-form
  formState: FormState<TransactionFormValues>
  control: Control<TransactionFormValues, object, TransactionFormValues>
  currentType: TransactionType
}

const TransactionForm = ({
  // states
  selectedTransaction,
  isFormOpen,
  // handlers
  onSubmit: handleSubmit,
  onAmountBlur: handleAmountBlur,
  onTypeClick: handleTypeClick,
  onDeleteClick: handleDeleteClick,
  onCloseClick: handleCloseClick,
  // react-hook-form
  formState: { errors, isDirty },
  control,
  currentType,
}: TransactionFormProps) => {
  const portalRenderer = usePortal('modal')
  const theme = useTheme()

  // タブレット以下と、PC版での共通部分
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">入力</Typography>

        {/* 閉じるボタン */}
        <IconButton
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleCloseClick}
        >
          <Close />
        </IconButton>
      </Box>

      {/* フォーム要素 */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={field.value === 'expense' ? 'contained' : 'outlined'}
                    color="error"
                    onClick={handleTypeClick('expense')}
                  >
                    支出
                  </Button>
                  <Button
                    variant={field.value === 'income' ? 'contained' : 'outlined'}
                    onClick={handleTypeClick('income')}
                  >
                    収入
                  </Button>
                </ButtonGroup>
              )
            }}
          />

          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="日付"
                type="date"
                slotProps={{ inputLabel: { shrink: true } }}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            )}
          />

          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => {
              const categories = currentType === 'income' ? incomeCategories : expenseCategories
              return (
                <FormControl error={!!errors.category}>
                  <InputLabel id="category-label">カテゴリ</InputLabel>
                  <Select
                    labelId="category-label"
                    id="category-select"
                    {...field}
                    label="カテゴリ"
                    MenuProps={{
                      // ドロップダウンメニューがモーダル背後に隠れないようにzIndexを調整
                      sx: { zIndex: theme.zIndex.transactionForm.md + 10 },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem value={category.label} key={category.label}>
                        <ListItemIcon>{category.icon}</ListItemIcon>
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.category?.message}</FormHelperText>
                </FormControl>
              )
            }}
          />

          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field}
                label="金額"
                type="number"
                onBlur={handleAmountBlur(field)}
              />
            )}
          />

          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.content}
                helperText={errors.content?.message}
                {...field}
                label="内容"
                type="text"
              />
            )}
          />

          {/* 保存・更新ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === 'income' ? 'primary' : 'error'}
            disabled={!isDirty}
            fullWidth
          >
            {selectedTransaction === null ? '保存' : '更新'}
          </Button>

          {/* 削除ボタン */}
          {selectedTransaction && (
            <Button variant="outlined" color="secondary" onClick={handleDeleteClick} fullWidth>
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  )

  return (
    <>
      {/* タブレット以下 */}
      {portalRenderer(
        <>
          <Mask $isOpen={isFormOpen} $zIndex={theme.zIndex.transactionForm.md - 1} onClick={handleCloseClick} />
          <FormTablet $isFormOpen={isFormOpen}>{formContent}</FormTablet>
        </>
      )}
      {/* ラップトップ以上 */}
      <StickyContext>
        <FormLaptop $isFormOpen={isFormOpen}>{formContent}</FormLaptop>
      </StickyContext>
    </>
  )
}

export default TransactionForm
