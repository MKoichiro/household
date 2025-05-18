import NotificationItem from './Notification'
import { useNotifications, usePortal } from '../../shared/hooks/useContexts'
import { Badge, Divider, styled as muiStyled } from '@mui/material'
import styled from '@emotion/styled'
import { AnimatePresence } from 'framer-motion'
import NotificationsIcon from '@mui/icons-material/Notifications'

const RightSideBadge = muiStyled(Badge)({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    padding: '0 4px',
  },
})

const NotificationPadRoot = styled.div<{ $length: number }>`
  border-radius: 0.5rem;
  position: fixed;
  bottom: 0.5rem;
  left: 0.5rem;
  z-index: ${({ theme }) => theme.zIndex.notificationPad.xs};
  max-width: 50vw;
  max-height: 30vh;
  overflow-y: auto;
  background: rgba(255 255 255 / 0.3);

  /* 通知が１つのときは、ラッパー消失分だけマージンをつける */
  margin-left: ${({ $length }) => ($length === 1 ? '0.5rem' : 0)};
  margin-bottom: ${({ $length }) => ($length === 1 ? '0.5rem' : 0)};
  /* box‑shadow の切り替え */
  box-shadow: ${({ $length }) => ($length === 0 ? 'none' : '0.125rem 0.125rem 0.25rem 0.125rem rgba(0, 0, 0, 0.1)')};

  /* スクロールバー非表示 */
  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
  overscroll-behavior: contain;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 90vw;
    max-width: 90vw;
    left: 50%;
    transform: translateX(-50%);
  }
`

const NotificationHeader = styled.div`
  display: flex;
  position: sticky;
  backdrop-filter: blur(0.5rem);
  top: 0;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: transparent;
`

const NotificationContent = styled.div<{ $length: number }>`
  /* 通知が１つのときは疑似的にラッパーを非表示に */
  padding-right: ${({ $length }) => ($length === 1 ? 0 : '0.5rem')};
  padding-left: ${({ $length }) => ($length === 1 ? 0 : '0.5rem')};
`

const NotificationPad = () => {
  const { notifications, removeNotification, removeAllNotifications } = useNotifications()

  const handleClose = (id: string) => () => removeNotification(id)
  const handleRemoveAllClick = () => removeAllNotifications()

  // 通知を逆順にする。これにより、最新の通知が上に表示される
  const descNotifications = [...notifications].reverse()

  const portalRenderer = usePortal('notification')

  return (
    <>
      {portalRenderer(
        <NotificationPadRoot $length={descNotifications.length}>
          {descNotifications.length > 1 && (
            <>
              <NotificationHeader>
                <RightSideBadge badgeContent={descNotifications.length} color="secondary">
                  <NotificationsIcon color="action" />
                </RightSideBadge>
                <button
                  onClick={handleRemoveAllClick}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  すべて消去
                </button>
              </NotificationHeader>
              <Divider />
            </>
          )}
          <NotificationContent $length={descNotifications.length}>
            <AnimatePresence>
              {descNotifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClose={handleClose(n.id)}
                  isOne={descNotifications.length === 1}
                />
              ))}
            </AnimatePresence>
          </NotificationContent>
        </NotificationPadRoot>
      )}
    </>
  )
}

export default NotificationPad
