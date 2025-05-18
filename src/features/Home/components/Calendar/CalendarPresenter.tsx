import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocal from '@fullcalendar/core/locales/ja'
import { EventContentArg } from '@fullcalendar/core/index.js'
import interactionPlugin from '@fullcalendar/interaction'
import { Backdrop } from '@mui/material'
import styled from '@emotion/styled'
import { CalendarActions, CalendarStates } from './CalendarContainer'
import { indigo } from '@mui/material/colors'
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
  const { handleDateClick, handleDatesSet, setAspectRatio, headerHandlers } = actions
  return (
    <>
      <CalendarHeader currentMonth={currentMonth} {...headerHandlers} />
      <StyleContext ref={scrollJudgeElementRef}>
        <FullCalendar
          ref={calendarRef}
          locale={jaLocal}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={[...events, selectedEvent]}
          eventContent={renderEventContent}
          datesSet={handleDatesSet}
          dateClick={handleDateClick}
          headerToolbar={false}
          aspectRatio={setAspectRatio()}
          height="auto"
          longPressDelay={10} // デフォルト 1000ms → 10ms
          selectLongPressDelay={10} // デフォルト 1000ms → 10ms
        />
        <Backdrop
          open={isResizing}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 500,
            backgroundColor: indigo[100],
            display: { xs: 'none', md: 'none', lg: 'block' },
          }}
        />
      </StyleContext>
    </>
  )
}

export default CalendarPresenter

// スタイル
const StyleContext = styled.div`
  /* 独立したスタッキングコンテキストを生成し、背面に移動 */
  position: relative;
  isolation: isolate;
  z-index: 0;

  /* カレンダーのスタイルここから */
  /* FullCalendarはclassNameを受け取れないのでこのラッパーから定義 */

  /* 曜日ヘッド */
  .fc .fc-col-header-cell {
    background-color: ${({ theme }) => theme.palette.ui.calendar.head.bg.main};
    color: ${({ theme }) => theme.palette.ui.calendar.head.font.main};
  }

  /* aタグ */
  .fc-h-event {
    background-color: transparent;
    border: none;
    text-align: right;
    pointer-events: none;
  }

  /* カレンダーの背景色設定 */
  .fc-daygrid-body,
  .fc-day {
    background-color: white;
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
      color: ${({ theme }) => theme.palette.incomeColor.main};
    }
    &.expense {
      color: ${({ theme }) => theme.palette.expenseColor.main};
    }
    &.balance {
      color: ${({ theme }) => theme.palette.balanceColor.main};
    }
  }
`
