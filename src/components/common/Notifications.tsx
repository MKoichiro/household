// Notification.tsx
import NotificationItem from './NotificationItem'
import { useNotifications } from '../../hooks/useContexts'
import { Stack } from '@mui/material'

const Notifications = () => {
  const { notifications, removeNotification } = useNotifications()

  // 通知がない場合はラッパーのStackも非表示にするため
  // if (notifications.length === 0) {
  //   return null
  // }

  const handleClose = (id: string) => () => {
    removeNotification(id)
  }

  return (
    <Stack
      spacing={1.5}
      sx={{
        outline: 'red solid 1px', // デバッグ用
        borderRadius: '0.5rem',
        px: 1,
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        zIndex: 1400,
        maxWidth: '90%',
        maxHeight: '30vh',
        overflowY: 'auto',

        // スクロール示唆のためのインナーシャドウ
        '&::after': {
          content: '""',
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '10%',
          background: 'linear-gradient(to top, rgba(255, 255, 255, 1), transparent)',
          pointerEvents: 'none',
          // 追加: CSS Scroll-Linked Animations実験的機能によるフェード制御
          animation: 'fadeShadow 1s linear both',
          animationTimeline: 'notificationScroll',
        },
      }}
    >
      {[...notifications]
        .slice()
        .reverse()
        .map((n) => (
          <NotificationItem key={n.id} notification={n} onClose={handleClose(n.id)} />
        ))}
    </Stack>
  )
}

export default Notifications
