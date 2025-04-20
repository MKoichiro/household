import {
  Box,
  Typography,
  FormControl,
  TextField,
  FormLabel,
  Stack,
  Divider,
  Grid,
  IconButton,
  FormHelperText,
} from '@mui/material'
import { useAuth, useNotifications } from '../hooks/useContexts'
import EditIcon from '@mui/icons-material/Edit'
import SendIcon from '@mui/icons-material/Send'
import { FormEvent, Fragment, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import styled from '@emotion/styled'

const SettingsRoot = styled.div`
  margin: 0 auto;
  display: flex;
  justify-content: center;
  width: 100%;
`

const displayNameSchema = z.object({
  displayName: z.string().max(20, { message: 'ユーザー名は20文字以内である必要があります' }),
})

type DisplayNameFormValues = z.infer<typeof displayNameSchema>

const Settings = () => {
  const { user, handleUpdateDisplayName } = useAuth()
  const { addNotification } = useNotifications()

  // ユーザー基本情報の表示用データ
  const userDetails = useMemo(
    () => [
      { label: 'Email:', value: user?.email ?? '取得できませんでした。' },
      { label: 'UID:', value: user?.uid ?? '取得できませんでした。' },
      {
        label: '登録日時:',
        value: user?.metadata.creationTime
          ? format(user.metadata.creationTime, 'yyyy年M月d日 HH:mm')
          : '取得できませんでした。',
      },
      {
        label: '最終ログイン日時:',
        value: user?.metadata.lastSignInTime
          ? format(user.metadata.lastSignInTime, 'yyyy年M月d日 HH:mm')
          : '取得できませんでした。',
      },
    ],
    [user]
  )

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<DisplayNameFormValues>({
    resolver: zodResolver(displayNameSchema),
    defaultValues: { displayName: user?.displayName ?? '' },
  })

  const [isEditing, setIsEditing] = useState(false)

  const onEditClick = () => setIsEditing(true)

  const onSubmit = async (data: DisplayNameFormValues) => {
    try {
      await handleUpdateDisplayName(data.displayName)
      setIsEditing(false)
      reset({
        displayName: data.displayName,
      })
      addNotification({
        severity: 'success',
        message: 'ユーザー名が更新されました',
        timer: 3000,
      })
    } catch (error) {
      console.error('Error updating display name:', error)
      addNotification({
        severity: 'error',
        message: 'ユーザー名の更新に失敗しました',
      })
    }
  }

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    void handleSubmit(onSubmit)(e)
  }

  // フォーカスが外れら編集モードを終了するための関数
  const handleDisplayNameBlur = () => {
    // 現行の同期処理を待ってからフォーカスを外す
    // これをしないと、submitボタンを押してもフォーカスが外れず、submitイベントが発火しない
    setTimeout(() => {
      // フォーカスがsubmitボタンに当たっていない場合、編集モードを終了する
      if (document.activeElement?.id !== 'displayName-submit-btn') {
        setIsEditing(false)
        reset()
      }
    }, 0)
  }

  // ユーザー情報が取得できなかった場合
  if (!user) {
    return <Typography variant="h6">ユーザー情報が取得できませんでした。</Typography>
  }

  return (
    <>
      {/* ユーザー名 */}
      <Stack spacing={2} sx={{ width: '100%' }}>
        {!isEditing && user.displayName ? (
          // 表示モード
          <Stack>
            <Typography variant="h6" component="span">
              ユーザー名:
            </Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid size={10}>
                <Typography variant="body1" color="text.secondary">
                  {user.displayName || '未設定'}
                </Typography>
              </Grid>
              <Divider orientation="vertical" flexItem sx={{ mx: 'auto' }} />
              <Grid size={1}>
                <IconButton aria-label="edit" type="button" onClick={onEditClick}>
                  <EditIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Stack>
        ) : (
          // 編集モード
          <Box component="form" onSubmit={handleFormSubmit}>
            <Controller
              name="displayName"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <FormLabel htmlFor="displayName">
                    <Typography variant="h6" component="span" color="text.primary">
                      ユーザー名:
                    </Typography>
                  </FormLabel>
                  <Grid container spacing={1} alignItems="center">
                    <Grid size={10}>
                      <TextField
                        {...field}
                        autoComplete="off"
                        id="displayName"
                        error={!!errors.displayName}
                        onBlur={handleDisplayNameBlur}
                        margin="normal"
                        fullWidth
                      />
                    </Grid>
                    <Divider orientation="vertical" flexItem sx={{ mx: 'auto' }} />
                    <Grid size={1}>
                      <IconButton id="displayName-submit-btn" aria-label="submit" type="submit" disabled={!isDirty}>
                        <SendIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                  {errors.displayName && <FormHelperText error>{errors.displayName.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Box>
        )}

        {/* その他のユーザー情報の表示 */}
        {userDetails.map((detail) => (
          <Fragment key={detail.label}>
            <Typography variant="h6" component="span">
              {detail.label}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {detail.value}
            </Typography>
          </Fragment>
        ))}
      </Stack>
    </>
  )
}

export default Settings
