// TODO: 初回レンダー時、タブレット以下でメニュー開閉時毎回、のタイミングで不要なBackdropのちらつきがある
// TODO: useWindowSizeを廃止

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocal from '@fullcalendar/core/locales/ja'
import '../../../calendar.css'
import { DatesSetArg, EventContentArg } from '@fullcalendar/core/index.js'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { Backdrop, useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styled from '@emotion/styled'
import { CalendarContent, DailyBalances, Transaction } from '../../../shared/types'
import { calculateDailyBalances } from '../../../shared/utils/financeCalculations'
import { formatCurrency, getFormattedToday } from '../../../shared/utils/formatting'
import { useApp, useWindowSize } from '../../../shared/hooks/useContexts'

// const events = [
//   { title: 'Meeting', start: "2025-03-31",  },
//   { title: 'Meeting', start: "2025-03-31", income: 300, expense: 200, balance: 100 },
// ]

const renderEventContent = (eventInfo: EventContentArg) => {
  return (
    <div>
      <div className="money" id="event-income">
        {eventInfo.event.extendedProps.income}
      </div>
      <div className="money" id="event-expense">
        {eventInfo.event.extendedProps.expense}
      </div>
      <div className="money" id="event-balance">
        {eventInfo.event.extendedProps.balance}
      </div>
    </div>
  )
}

export interface CalendarProps {
  monthlyTransactions: Transaction[]
  setCurrentMonth: Dispatch<SetStateAction<Date>>
  selectedDay: string
  setSelectedDay: Dispatch<SetStateAction<string>>
  onDateClick: (dateInfo: DateClickArg) => void
}

const Calendar = ({
  monthlyTransactions: transactions,
  setCurrentMonth,
  selectedDay,
  setSelectedDay,
  onDateClick: handleDateClick,
}: CalendarProps) => {
  const dailyBalances = calculateDailyBalances(transactions)
  const theme = useTheme()

  const eventsCreator = (dailyBalances: DailyBalances): CalendarContent[] => {
    const dates: string[] = Object.keys(dailyBalances)
    return dates.map((date) => {
      const { income, expense, balance } = dailyBalances[date]
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      }
    })
  }

  const calendarEvents = eventsCreator(dailyBalances)

  const handleDatesSet = (datesSetInfo: DatesSetArg) => {
    const currentMonth = datesSetInfo.view.currentStart
    setCurrentMonth(currentMonth)

    const todayDate = new Date()
    if (isSameMonth(todayDate, currentMonth)) {
      setSelectedDay(getFormattedToday())
    }
  }

  const selectedEvent = {
    start: selectedDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  }

  // アスペクト比をレスポンシブ対応、aspectRatio属性の設定値を返す
  // 縦1の時の横の指定, see: https://fullcalendar.io/docs/aspectRatio
  const { down } = useWindowSize()

  const setAspectRatio = () => {
    if (down('md')) return 2 // スマホ
    if (down('lg')) return 1.35 // タブレット
    if (down('xl')) return 2 // デスクトップ以下
    return 2 // 大きいデスクトップ
  }

  // navigationMenuの開閉に応じてカレンダーをリサイズを更新するため処理
  const animationDuration = 300
  const { isNavigationMenuOpen } = useApp()
  const calendarRef = useRef<FullCalendar>(null)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    setIsResizing(true)
    const api = calendarRef.current?.getApi() // see: https://fullcalendar.io/docs/updateSize
    // 開閉アニメーションの後にサイズを更新
    const timeoutId = setTimeout(() => {
      api?.updateSize()
      setTimeout(() => setIsResizing(false), 100) // 余韻を持たせる
    }, animationDuration)

    return () => clearTimeout(timeoutId)
  }, [isNavigationMenuOpen])

  return (
    <CalendarWrapper>
      <FullCalendar
        ref={calendarRef}
        locale={jaLocal}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={[...calendarEvents, selectedEvent]}
        eventContent={renderEventContent}
        datesSet={handleDatesSet}
        dateClick={handleDateClick}
        headerToolbar={{
          start: 'title',
          // center: 'myCustomButton', // ここにcustomButtonsで作ったボタンを指定。
          end: 'today prev,next',
        }}
        // customButtons={{
        //   myCustomButton: {
        //     text: 'test',
        //     click: function () {
        //       alert('clicked the custom button!')
        //     },
        //   },
        // }}

        aspectRatio={setAspectRatio()}
        height="auto"
      />
      <Backdrop
        open={isResizing}
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 500,
          backdropFilter: 'blur(1rem)',
          backgroundColor: 'transparent',
        }}
      />
    </CalendarWrapper>
  )
}

export default Calendar

// MUI Drawerの前面にFullCalendarが表示されるのを防ぐために、
// 独立したスタッキングを生成するためのラッパー
const CalendarWrapper = styled.div`
  position: relative;
  isolation: isolate;
  z-index: 0;

  .fc .fc-col-header-cell {
    background-color: ${({ theme }) => theme.palette.header.main};
  }
  .fc .fc-col-header-cell-cushion {
    color: white;
  }
  .fc .fc-button {
    background-color: ${({ theme }) => theme.palette.header.main};
  }

  /* カレンダー部分 */
  .fc .fc-view-harness {
    /* min-height: 40rem; */
  }
`
