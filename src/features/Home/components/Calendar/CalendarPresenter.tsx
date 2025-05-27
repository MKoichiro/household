import styled from '@emotion/styled'
import type { EventContentArg } from '@fullcalendar/core'
import jaLocal from '@fullcalendar/core/locales/ja'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { CircularProgress } from '@mui/material'

import { cp } from '@styles/theme/helpers/colorPickers'

import type { CalendarActions, CalendarStates } from './CalendarContainer'
import CalendarHeader from './CalendarHeader'

const renderEventContent = (eventInfo: EventContentArg) => {
  const { income, expense, balance } = eventInfo.event.extendedProps
  return (
    <div>
      <span className="transaction-amount income">{income}</span>
      <span className="transaction-amount expense">{expense}</span>
      <span className="transaction-amount balance">{balance}</span>
    </div>
  )
}

interface CalendarPresenterProps {
  states: CalendarStates
  actions: CalendarActions
}

const CalendarPresenter = ({ states, actions }: CalendarPresenterProps) => {
  const { calendarRef, scrollJudgeElementRef, events, selectedEvent, isResizing, currentMonth } = states
  const { handleDateClick, handleDatesSet, setAspectRatio, handleDayCellClassNames, headerHandlers } = actions
  return (
    <>
      <CalendarHeader currentMonth={currentMonth} {...headerHandlers} />
      <StyledContext className="calendar-context" ref={scrollJudgeElementRef}>
        <FullCalendar
          ref={calendarRef}
          locale={jaLocal}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={[...events, selectedEvent]}
          eventContent={renderEventContent}
          datesSet={handleDatesSet}
          dateClick={handleDateClick}
          dayCellClassNames={handleDayCellClassNames(['fc-day-selected'])}
          dayCellContent={(cellInfo) => cellInfo.date.getDate()}
          headerToolbar={false}
          aspectRatio={setAspectRatio()}
          height="auto"
          longPressDelay={10} // デフォルト 1000ms → 10ms
          selectLongPressDelay={10} // デフォルト 1000ms → 10ms
        />
        <ResizeOverlay $open={isResizing}>
          <CircularProgress />
        </ResizeOverlay>
      </StyledContext>
    </>
  )
}

const ResizeOverlay = styled.div<{ $open: boolean }>`
  display: none;
  ${({ theme }) => theme.breakpoints.up('md')} {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
    position: absolute;
    inset: 0;
    z-index: 500;
    background-color: ${({ theme }) => cp(theme, 'ui.calendar.mask')};
  }
`

// スタイル
const StyledContext = styled.div`
  /* 独立したスタッキングコンテキストを生成し、背面に移動 */
  position: relative;
  isolation: isolate;
  z-index: 0;

  /* カレンダーのスタイルここから、CSS 変数のリセットは GlobalStyles.tsx 参照 */
  /* FullCalendar は className を受け取れないのでこのラッパーから定義 */

  box-shadow: ${({ theme }) => theme.shadows[1]};
  /* ボーダーリセット */
  &,
  th,
  table,
  td[role='presentation'],
  .fc-theme-standard .fc-scrollgrid {
    border-width: 0;
    border-color: transparent;
    border: none;
  }
  /* border-radius */
  border-radius: 0.75rem;
  overflow: hidden;

  /* ─── 曜日ヘッド ─── */
  /* 平日 */
  .fc .fc-col-header-cell.fc-day-mon,
  .fc .fc-col-header-cell.fc-day-tue,
  .fc .fc-col-header-cell.fc-day-wed,
  .fc .fc-col-header-cell.fc-day-thu,
  .fc .fc-col-header-cell.fc-day-fri {
    background: ${({ theme }) => cp(theme, 'ui.calendar.head.bg.weekday')};
    color: ${({ theme }) => cp(theme, 'ui.calendar.head.font.weekday')};
    border: ${({ theme }) => cp(theme, 'ui.calendar.head.border.weekday')};
  }
  /* 土曜 */
  .fc .fc-col-header-cell.fc-day-sat {
    background: ${({ theme }) => cp(theme, 'ui.calendar.head.bg.saturday')};
    color: ${({ theme }) => cp(theme, 'ui.calendar.head.font.saturday')};
    border: ${({ theme }) => cp(theme, 'ui.calendar.head.border.saturday')};
  }
  /* 日曜 */
  .fc .fc-col-header-cell.fc-day-sun {
    background: ${({ theme }) => cp(theme, 'ui.calendar.head.bg.sunday')};
    color: ${({ theme }) => cp(theme, 'ui.calendar.head.font.sunday')};
    border: ${({ theme }) => cp(theme, 'ui.calendar.head.border.sunday')};
  }

  /* ─── グリッドセル ─── */
  /* 平日 */
  .fc-daygrid-day.fc-day-mon,
  .fc-daygrid-day.fc-day-tue,
  .fc-daygrid-day.fc-day-wed,
  .fc-daygrid-day.fc-day-thu,
  .fc-daygrid-day.fc-day-fri {
    background: ${({ theme }) => cp(theme, 'ui.calendar.cells.bg.weekday')};
    color: ${({ theme }) => cp(theme, 'ui.calendar.cells.font.weekday')};
    border: ${({ theme }) => cp(theme, 'ui.calendar.cells.border.weekday')};
  }
  /* 土曜 */
  .fc-daygrid-day.fc-day-sat {
    background: ${({ theme }) => cp(theme, 'ui.calendar.cells.bg.saturday')};
    color: ${({ theme }) => cp(theme, 'ui.calendar.cells.font.saturday')};
    border: ${({ theme }) => cp(theme, 'ui.calendar.cells.border.saturday')};
  }
  /* 日曜 */
  .fc-daygrid-day.fc-day-sun {
    background: ${({ theme }) => cp(theme, 'ui.calendar.cells.bg.sunday')};
    color: ${({ theme }) => cp(theme, 'ui.calendar.cells.font.sunday')};
    border: ${({ theme }) => cp(theme, 'ui.calendar.cells.border.sunday')};
  }
  /* 今日 */
  .fc-daygrid-day.fc-day-today > .fc-daygrid-day-frame {
    background: ${({ theme }) => cp(theme, 'ui.calendar.cells.bg.today')};
    color: ${({ theme }) => cp(theme, 'ui.calendar.cells.font.today')};
    border: ${({ theme }) => cp(theme, 'ui.calendar.cells.border.today')};
  }
  /* 選択中 */
  .fc-daygrid-day.fc-day-selected {
    .fc-bg-event {
      background: none; /* reset */
      opacity: 0;
    }
    & > .fc-daygrid-day-frame {
      background: ${({ theme }) => cp(theme, 'ui.calendar.cells.bg.selected')};
      border: ${({ theme }) => cp(theme, 'ui.calendar.cells.border.selected')};
      color: ${({ theme }) => cp(theme, 'ui.calendar.cells.font.selected')};
    }
  }

  /* 日付部分（通常） */
  .fc-daygrid-day-top {
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    font-size: 1.8rem;
    line-height: 1.5;
  }
  /* 日付部分（今日） */
  .fc-daygrid-day.fc-day-today .fc-daygrid-day-top {
    font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  }
  /* 日付部分（選択中） */
  .fc-daygrid-day.fc-day-selected .fc-daygrid-day-top {
    font-weight: ${({ theme }) => theme.typography.fontWeightBold};
  }

  /* aタグ */
  .fc-h-event {
    background-color: transparent;
    border: none;
    text-align: right;
    pointer-events: none;
  }

  .fc .fc-daygrid-day-frame {
    height: 100%;
    min-height: 100px;
  }

  /* カスタムイベントの見た目ここから */
  .transaction-amount {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.income {
      color: ${({ theme }) => cp(theme, 'income.font.lighter')};
    }
    &.expense {
      color: ${({ theme }) => cp(theme, 'expense.font.lighter')};
    }
    &.balance {
      color: ${({ theme }) => cp(theme, 'balance.font.lighter')};
    }
  }
`

export default CalendarPresenter
