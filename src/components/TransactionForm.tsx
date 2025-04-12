import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
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
import { ExpenseCategory, IncomeCategory, Transaction, TransactionFormValues, TransactionType } from '../types'
import { BaseSyntheticEvent, JSX } from 'react'

const formWidth = 320

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

interface TransactionFormProps {
  // states
  selectedTransaction: Transaction | null
  isUnderLG: boolean
  isEntryDrawerOpen: boolean
  isModalOpen: boolean
  // handlers
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>
  onAmountBlur: (field: ControllerRenderProps<TransactionFormValues, 'amount'>) => () => void
  onTypeClick: (type: TransactionType) => () => void
  onDeleteClick: () => void
  onCloseClick: () => void
  onDialogClose: () => void
  // react-hook-form
  formState: FormState<TransactionFormValues>
  control: Control<TransactionFormValues, object, TransactionFormValues>
  // control: Control<TransactionFormValues, any, TransactionFormValues>
  currentType: TransactionType
}

const TransactionForm = ({
  // states
  selectedTransaction,
  isUnderLG,
  isEntryDrawerOpen,
  isModalOpen,
  // handlers
  onSubmit: handleSubmit,
  onAmountBlur: handleAmountBlur,
  onTypeClick: handleTypeClick,
  onDeleteClick: handleDeleteClick,
  onCloseClick: handleCloseClick,
  onDialogClose: handleDialogClose,
  // react-hook-form
  formState: { errors, isDirty },
  control,
  currentType,
}: TransactionFormProps) => {
  // タブレット以下と、PC版での共通部分
  const formContent = (
    <>
      {/* 入力エリアヘッダー */}
      <Box display={'flex'} justifyContent={'space-between'} mb={2}>
        <Typography variant="h6">入力</Typography>

        {/* 閉じるボタン */}
        <IconButton
          sx={{
            color: theme => theme.palette.grey[500],
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
              // console.log(field)
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={field.value === 'expense' ? 'contained' : 'outlined'}
                    color="error"
                    // sx={{
                    //   bgcolor: theme.palette.expenseColor.dark
                    // }}
                    onClick={handleTypeClick('expense')}
                  >
                    支出
                  </Button>
                  <Button
                    variant={field.value === 'income' ? 'contained' : 'outlined'}
                    onClick={handleTypeClick('income')}
                    // color={"primary"} // デフォルト
                    // sx={{
                    //   bgcolor: theme.palette.incomeColor.dark
                    // }}
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
                // onChangeの指定はreact-hook-formの上書きになるので注意。
                // 独自にonChangeを追加する場合はfield.onChange(e)で元の更新処理も実行する。
                // onChange={() => console.log(field)} // NG
                // onChange={(e) => { console.log(field); field.onChange(e)}} // OK
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
                  <Select labelId="category-label" id="category-select" {...field} label="カテゴリ">
                    {categories.map(category => (
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
      {isUnderLG ? (
        // tablet以下はダイアログ
        <Dialog open={isModalOpen} fullWidth sx={{ maxWidth: 'sm', mx: 'auto' }} onClose={handleDialogClose}>
          <DialogContent>{formContent}</DialogContent>
        </Dialog>
      ) : (
        // PC版はドロワー
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            right: isEntryDrawerOpen ? formWidth : '-5%', // shadow部分も隠れるように。
            width: formWidth,
            height: '100%',
            bgcolor: 'background.paper',
            zIndex: theme => theme.zIndex.drawer - 1,
            transition: theme =>
              theme.transitions.create('right', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            p: 2, // 内部の余白
            boxSizing: 'border-box', // ボーダーとパディングをwidthに含める
            boxShadow: '0px 0px 15px -5px #777777',
          }}
        >
          {formContent}
        </Box>
      )}
    </>
  )
}

export default TransactionForm
