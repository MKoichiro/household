import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import jaLocal from '@fullcalendar/core/locales/ja'
import '../calendar.css'
import { DatesSetArg, EventContentArg } from '@fullcalendar/core/index.js'
import { CalendarContent, DailyBalances, Transaction } from '../types'
import { calculateDailyBalances } from '../utils/financeCalculations'
import { formatCurrency, getFormattedToday } from '../utils/formatting'
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'
import styled from '@emotion/styled'

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

interface CalendarProps {
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

  return (
    <CalendarWrapper>
      <FullCalendar
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
`
