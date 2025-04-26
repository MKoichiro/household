// TODO: 初回レンダー時、タブレット以下でメニュー開閉時毎回、のタイミングで不要なBackdropのちらつきがある
import FullCalendar from '@fullcalendar/react'
import { DatesSetArg } from '@fullcalendar/core/index.js'
import { DateClickArg } from '@fullcalendar/interaction'
import { useMediaQuery, useTheme } from '@mui/material'
import { isSameMonth } from 'date-fns'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { CalendarContent, DailyBalances, Transaction } from '../../../../shared/types'
import { calculateDailyBalances } from '../../../../shared/utils/financeCalculations'
import { formatCurrency, getFormattedToday } from '../../../../shared/utils/formatting'
import CalendarPresenter from './CalendarPresenter'
import { useLayout } from '../../../../shared/hooks/useContexts'

// eventsCreator returns like this:
// const events = [
//   { title: 'Meeting', start: "2025-03-31", income: 300, expense: 200, balance: 100 },
//   ...,
// ]
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

export interface CalendarStates {
  ref: React.RefObject<FullCalendar | null>
  events: CalendarContent[]
  selectedEvent: { start: string; display: string; backgroundColor: string }
  isResizing: boolean
}

export interface CalendarActions {
  handleDateClick: (dateInfo: DateClickArg) => void
  handleDatesSet: (datesSetInfo: DatesSetArg) => void
  setAspectRatio: () => number
}

export interface CalendarProps {
  monthlyTransactions: Transaction[]
  setCurrentMonth: Dispatch<SetStateAction<Date>>
  selectedDay: string
  setSelectedDay: Dispatch<SetStateAction<string>>
  onDateClick: (dateInfo: DateClickArg) => void
}

const CalendarContainer = ({
  monthlyTransactions: transactions,
  setCurrentMonth,
  selectedDay,
  setSelectedDay,
  onDateClick: handleDateClick,
}: CalendarProps) => {
  const theme = useTheme()

  const dailyBalances = calculateDailyBalances(transactions)
  const calendarEvents = eventsCreator(dailyBalances)

  const handleDatesSet = (datesSetInfo: DatesSetArg) => {
    const currentMonth = datesSetInfo.view.currentStart
    setCurrentMonth(currentMonth)
    const todayDate = new Date()

    if (isSameMonth(todayDate, currentMonth)) setSelectedDay(getFormattedToday())
  }

  const selectedEvent = {
    start: selectedDay,
    display: 'background',
    backgroundColor: theme.palette.incomeColor.light,
  }

  // アスペクト比をレスポンシブ対応、aspectRatio属性の設定値を返す
  // 縦1の時の横の指定, see: https://fullcalendar.io/docs/aspectRatio
  const downMd = useMediaQuery(theme.breakpoints.down('md'))
  const downLg = useMediaQuery(theme.breakpoints.down('lg'))
  const downXl = useMediaQuery(theme.breakpoints.down('xl'))

  const setAspectRatio = () => {
    if (downMd) return 2 // スマホ
    if (downLg) return 1.35 // タブレット
    if (downXl) return 2 // デスクトップ以下
    return 2 // 大きいデスクトップ
  }

  // navigationMenuの開閉に応じてカレンダーをリサイズを更新するため処理
  const animationDuration = 300
  const { isNavigationMenuOpen } = useLayout()
  const calendarRef = useRef<FullCalendar>(null)
  const [isResizing, setIsResizing] = useState(false)
  const previouslyOpen = useRef(isNavigationMenuOpen)

  useEffect(() => {
    // タブレット以下ではNavigationMenuはオーバーレイ表示なのでカレンダーのリサイズは発生しない
    if (downLg) return

    // 前回開閉状態と比較するロジックを用いて、メニュー開閉以外でのリサイズを防ぐ
    if (previouslyOpen.current === isNavigationMenuOpen) return
    previouslyOpen.current = isNavigationMenuOpen // 次回の比較用に更新

    setIsResizing(true)
    const api = calendarRef.current?.getApi() // see: https://fullcalendar.io/docs/updateSize
    // 開閉アニメーションの後にサイズを更新
    const timeoutId = setTimeout(() => {
      api?.updateSize()
      setTimeout(() => setIsResizing(false), 100) // 余韻を持たせる
    }, animationDuration)

    return () => clearTimeout(timeoutId)
  }, [downLg, isNavigationMenuOpen])

  const states: CalendarStates = {
    ref: calendarRef,
    events: calendarEvents,
    selectedEvent,
    isResizing,
  }

  const actions: CalendarActions = {
    handleDateClick,
    handleDatesSet,
    setAspectRatio,
  }

  return <CalendarPresenter states={states} actions={actions} />
}

export default CalendarContainer
