import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import type { TypographyProps } from '@mui/material'
import { Box, Typography, FormControl, TextField, FormLabel, Stack, IconButton, FormHelperText } from '@mui/material'
import { format } from 'date-fns'
import type { User } from 'firebase/auth'
import type { FormEvent } from 'react'
import { useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { useAuth } from '@shared/hooks/useContexts'

const TitleTypography = (props: TypographyProps<'dt', { component?: 'dt' }>) => (
  <Typography {...props} variant="body1" component="dt" color="text.secondary" fontWeight="fontWeightBold" />
)
const DisplayNameTypography = (props: TypographyProps<'dt', { component?: 'dt' }>) => (
  <TitleTypography {...props}>ユーザー名</TitleTypography>
)
const ValueTypography = (props: TypographyProps<'dd', { component?: 'dd' }>) => (
  <Typography {...props} variant="body1" component="dd" color="text.secondary" sx={{ lineHeight: ddHeight }} />
)

const displayNameSchema = z.object({
  displayName: z.string().max(20, { message: 'ユーザー名は20文字以内にしてください' }),
})

type DisplayNameFormValues = z.infer<typeof displayNameSchema>

const switchStyle = (modeBool: boolean) => ({
  height: modeBool ? 'auto' : '0px',
  opacity: modeBool ? 1 : 0,
  pointerEvents: modeBool ? 'auto' : 'none',
  mt: '0 !important', // Stack の spacing をキャンセル
})

const ddHeight = '3rem'

const userDlMap = (user: User) => [
  { label: 'Email', value: user.email ?? '取得できませんでした。' },
  { label: 'UID', value: user.uid ?? '取得できませんでした。' },
  {
    label: '登録日時',
    value: user.metadata.creationTime
      ? format(user.metadata.creationTime, 'yyyy年M月d日 HH:mm')
      : '取得できませんでした。',
  },
  {
    label: '最終ログイン日時',
    value: user.metadata.lastSignInTime
      ? format(user.metadata.lastSignInTime, 'yyyy年M月d日 HH:mm')
      : '取得できませんでした。',
  },
]

const Settings = () => {
  const { user, handleUpdateDisplayName } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const userDetails = useMemo(() => (user ? userDlMap(user) : []), [user])
  const displayMode = !!(!isEditing && user?.displayName)
  const editMode = !displayMode
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<DisplayNameFormValues>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { displayName: user?.displayName ?? '' },
  })

  // ハンドラー
  const handleEditClick = () => {
    setIsEditing(true)
    // NOTE: RHF で提供される setFocus では iOS でキーボードとキャレットが表示されない。
    // そのため、「css で見かけ上非表示 + focus() の直接呼び出し」で対応。（条件付きレンダリングなどでデフォルトで非表示にすると focus() も効かない、詳しくは下記リンク参照）
    // この対応でもなお iOS ではキャレットが表示されない。
    // iOS の設計思想上、基本的にオートフォーカスを許していないらしく、これが限界。
    // なお、setSelectionRange() も iOS では動作しなかった。
    // see: https://zenn.dev/toshimarnie/scraps/f60026fce34e84
    inputRef.current?.focus()
  }

  // エラーハンドリングは handleUpdateDisplayName 内で行う
  const onSubmit = (data: DisplayNameFormValues) => {
    void handleUpdateDisplayName(data.displayName)
    setIsEditing(false)
    reset({ displayName: data.displayName })
    inputRef.current?.blur() // iOS でキーボードをしまう
  }
  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void handleSubmit(onSubmit)(e)
  }

  // フォーカスが外れら編集モードを終了するための関数
  const handleDisplayNameBlur = () => {
    // submit のクリックと bluer の競合を避けるために、setTimeout を使用
    setTimeout(() => {
      // フォーカスが submit ボタンに当たっていない場合、編集モードを終了する
      if (document.activeElement?.id !== 'displayName-submit-btn') {
        setIsEditing(false)
        reset()
        inputRef.current?.blur() // iOS でキーボードをしまう
      }
    }, 0)
  }

  // ユーザー情報が取得できなかった場合
  if (!user) {
    return <Typography variant="h6">ユーザー情報が取得できませんでした。</Typography>
  }

  return (
    <SettingRoot>
      <Stack component="dl" spacing={2} sx={{ width: '100%' }}>
        {/* ユーザー名: 表示モード */}
        <Stack sx={switchStyle(displayMode)}>
          <DisplayNameTypography />
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <ValueTypography flex={1}>{user.displayName || '未設定'}</ValueTypography>
            <IconButton
              aria-label="ユーザー名編集ボタン"
              type="button"
              onClick={handleEditClick}
              sx={{ height: ddHeight }}
            >
              <EditIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* ユーザー名: 編集モード */}
        <Box component="form" onSubmit={handleFormSubmit} sx={switchStyle(editMode)}>
          <Controller
            name="displayName"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <Stack>
                  <FormLabel htmlFor="displayName">
                    <DisplayNameTypography />
                  </FormLabel>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <TextField
                      {...field}
                      inputRef={inputRef}
                      autoComplete="off"
                      id="displayName"
                      error={!!errors.displayName}
                      onBlur={handleDisplayNameBlur}
                      margin="normal"
                      fullWidth
                      sx={{
                        flex: 1,
                        m: 0,
                        '& .MuiInputBase-input': {
                          px: '0.5em',
                          py: 0,
                          lineHeight: ddHeight,
                          height: ddHeight,
                          fontSize: '16px',
                        },
                      }}
                    />
                    <IconButton
                      id="displayName-submit-btn"
                      aria-label="ユーザー名編集の提出ボタン"
                      type="submit"
                      disabled={!isDirty}
                      sx={{ height: ddHeight }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Stack>
                </Stack>
                {errors.displayName && <FormHelperText error>{errors.displayName.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Box>

        {/* その他のユーザー情報の表示 */}
        {userDetails.map((detail) => (
          <Stack key={detail.label}>
            <TitleTypography>{detail.label}</TitleTypography>
            <ValueTypography>{detail.value}</ValueTypography>
          </Stack>
        ))}
      </Stack>
    </SettingRoot>
  )
}

const SettingRoot = styled.div``

export default Settings
