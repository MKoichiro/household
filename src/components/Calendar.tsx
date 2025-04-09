import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import jaLocal from "@fullcalendar/core/locales/ja"
import "../calendar.css"
import { DatesSetArg, EventContentArg } from "@fullcalendar/core/index.js"
import { CalendarContent, DailyBalances, Transaction } from "../types"
import { calculateDailyBalances } from "../utils/financeCalculations"
import { formatCurrency, getFormattedToday } from "../utils/formatting"
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import { useTheme } from "@mui/material"
import { isSameMonth } from "date-fns"

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
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  selectedDay: string;
  setSelectedDay: React.Dispatch<React.SetStateAction<string>>;
  onDateClick: (dateInfo: DateClickArg) => void;
}


const Calendar = ({
  monthlyTransactions: transactions,
  setCurrentMonth,
  selectedDay,
  setSelectedDay,
  onDateClick: handleDateClick,
}: CalendarProps) => {
  const dailyBalances = calculateDailyBalances(transactions)
  // console.log(dailyBalances["2025-03-10"])
  const theme = useTheme()

  // const { setValue } = useFormContext<TransactionFormValues>()

  const eventsCreator = (dailyBalances: DailyBalances): CalendarContent[] => {
    const dates: string[] = Object.keys(dailyBalances)
    return dates.map(date => {
      const { income, expense, balance } = dailyBalances[date]
      return {
        start: date,
        income: formatCurrency(income),
        expense: formatCurrency(expense),
        balance: formatCurrency(balance),
      }
    })
  }
  // console.log(eventsCreator(dailyBalances))

  const calendarEvents = eventsCreator(dailyBalances)

  const handleDatesSet = (datesSetInfo: DatesSetArg) => {
    // console.dir(datesSetInfo.view.currentStart);
    // console.dir(datesSetInfo);
    const currentMonth = datesSetInfo.view.currentStart
    setCurrentMonth(currentMonth)

    const todayDate = new Date()
    isSameMonth(todayDate, currentMonth) && setSelectedDay(getFormattedToday())
  }

  const selectedEvent = {
    start: selectedDay,
    display: "background",
    backgroundColor: theme.palette.incomeColor.light,
  }

  // const handleDateClick = (dateInfo: DateClickArg) => {
  //   // console.log(dateInfo);
  //   setSelectedDay(dateInfo.dateStr)
  //   setValue("date", dateInfo.dateStr)
  // }

  return (
    <FullCalendar
      locale={jaLocal}
      plugins={[dayGridPlugin, interactionPlugin ]}
      initialView="dayGridMonth"
      events={[...calendarEvents, selectedEvent]}
      eventContent={renderEventContent}
      datesSet={handleDatesSet}
      dateClick={handleDateClick}
      headerToolbar={{
        start: 'title',
        center: 'myCustomButton', // ここにcustomButtonsで作ったボタンを指定。
        end: 'today prev,next',
      }}
      customButtons={{
        myCustomButton: {
            text: 'test',
            click: function() {
                alert('clicked the custom button!');
            }
        }
    }}
    />
  )
}

export default Calendar
