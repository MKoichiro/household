import styled from '@emotion/styled'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { Badge, Divider, styled as muiStyled } from '@mui/material'
import { AnimatePresence } from 'framer-motion'

import { useNotifications, usePortal } from '@shared/hooks/useContexts'

import NotificationItem from './Notification'

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
  width: 90vw;
  max-width: 90vw;
  left: 50%;
  transform: translateX(-50%);
  max-height: 30vh;
  overflow-y: auto;
  background: ${({ $length }) => ($length <= 1 ? 'transparent' : 'rgba(255 255 255 / 0.3)')};
  /* 通知が１つのときはラッパーを消して表示している。ラッパーに付いている分の余白を別途つける */
  margin-left: ${({ $length }) => ($length === 1 ? '0.5rem' : 0)};
  margin-bottom: ${({ $length }) => ($length === 1 ? '0.5rem' : 0)};
  box-shadow: ${({ $length }) => ($length === 0 ? 'none' : '0.125rem 0.125rem 0.25rem 0.125rem rgba(0 0 0 / 0.1)')};
  /* スクロールバー非表示 */
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  overscroll-behavior: contain;
  z-index: ${({ theme }) => theme.zIndex.notificationPad.xs};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: auto;
    max-width: 50vw;
    left: 0.5rem;
    transform: none;
    z-index: ${({ theme }) => theme.zIndex.notificationPad.sm};
  }
  ${({ theme }) => theme.breakpoints.up('md')} {
    z-index: ${({ theme }) => theme.zIndex.notificationPad.md};
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    z-index: ${({ theme }) => theme.zIndex.notificationPad.lg};
  }
  ${({ theme }) => theme.breakpoints.up('xl')} {
    z-index: ${({ theme }) => theme.zIndex.notificationPad.xl};
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

export default NotificationPad
