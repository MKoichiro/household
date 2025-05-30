import type { DatesSetArg, DayCellContentArg } from '@fullcalendar/core'
import type { DateClickArg } from '@fullcalendar/interaction'
import type FullCalendar from '@fullcalendar/react'
import { useTheme } from '@mui/material'
import { format, isSameMonth } from 'date-fns'
import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { useApp, useLayout } from '@shared/hooks/useContexts'
import useScrollJudge from '@shared/hooks/useScrollJudge'
import type { CalendarContent, DailySummaries, Transaction } from '@shared/types'
import { debounce } from '@shared/utils/debounce'
import { calculateDailySummaries } from '@shared/utils/financeCalculations'
import { formatCurrency, getFormattedToday } from '@shared/utils/formatting'
import { cp } from '@styles/theme/helpers/colorPickers'

import CalendarPresenter from './Presenter'

// eventsCreator returns like this:
// const events = [
//   { title: 'Meeting', start: "2025-03-31", income: 300, expense: 200, balance: 100 },
//   ...,
// ]
const eventsCreator = (dailySummaries: DailySummaries): CalendarContent[] => {
  const dates: string[] = Object.keys(dailySummaries)
  return dates.map((date) => {
    const { income, expense, balance } = dailySummaries[date]
    return {
      start: date,
      income: formatCurrency(income),
      expense: formatCurrency(expense),
      balance: formatCurrency(balance),
    }
  })
}

export interface CalendarStates {
  calendarRef: RefObject<FullCalendar | null>
  scrollJudgeElementRef: RefObject<HTMLDivElement | null>
  events: CalendarContent[]
  selectedEvent: { start: string; display: string; backgroundColor: string }
  isResizing: boolean
  currentMonth: Date
}

export interface CalendarActions {
  handleDateClick: (dateInfo: DateClickArg) => void
  handleDatesSet: (datesSetInfo: DatesSetArg) => void
  handleDayCellClassNames: (classNames: string[]) => (cellArg: DayCellContentArg) => string[]
  setAspectRatio: () => number
  headerHandlers: {
    handlePrevMonthClick: () => void
    handleTodayClick: () => void
    handleNextMonthClick: () => void
  }
}

export interface CalendarProps {
  monthlyTransactions: Transaction[]
  onDateClick: (dateInfo: DateClickArg) => void
}

const CalendarContainer = ({ monthlyTransactions: transactions, onDateClick }: CalendarProps) => {
  const theme = useTheme()
  const { currentMonth, setCurrentMonth, selectedDay, setSelectedDay } = useApp()
  const calendarRef = useRef<FullCalendar>(null)
  const scrollJudgeElementRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useScrollJudge(scrollJudgeElementRef, { watchX: true })

  const dailySummaries = calculateDailySummaries(transactions)
  const calendarEvents = eventsCreator(dailySummaries)

  // fullcalendarの問題でスマホ版で、タップの感度が高く二重発火してしまうので、debounceをかける
  const handleDateClick = debounce((dateInfo: DateClickArg) => {
    if (isScrollingRef.current) return
    onDateClick(dateInfo)
  }, 100)

  // datesSet 属性のハンドラ何らかの方法で日付範囲が変更されたときにコールされる
  // see: https://fullcalendar.io/docs/datesSet
  const handleDatesSet = (datesSetInfo: DatesSetArg) => {
    const currentMonth = datesSetInfo.view.currentStart
    setCurrentMonth(currentMonth)
    const todayDate = new Date()

    if (isSameMonth(todayDate, currentMonth)) setSelectedDay(getFormattedToday())
  }

  const handleDayCellClassNames = (classNames: string[]) => (cellArg: DayCellContentArg) => {
    return format(cellArg.date, 'yyyy-MM-dd') === selectedDay ? classNames : []
  }

  // CalendarHeaderのボタンを押したときの処理
  const handlePrevMonthClick = () => {
    const api = calendarRef.current?.getApi()
    api?.prev()
    // NOTE: currentMonth の更新は handleDatesSet で行われる
    // .prev() が呼ばれて日付範囲が変わると、datesSet 属性に指定した handleDatesSet が発火する仕組み
    // see: https://fullcalendar.io/docs/datesSet
  }

  const handleTodayClick = () => {
    const api = calendarRef.current?.getApi()
    api?.today()
    // NOTE: selectedDay の更新は handleDatesSet で行う
  }

  const handleNextMonthClick = () => {
    const api = calendarRef.current?.getApi()
    api?.next()
    // NOTE: currentMonth の更新は handleDatesSet で行う
  }

  const selectedEvent = {
    start: selectedDay,
    display: 'background',
    backgroundColor: cp(theme, 'ui.calendar.cells.bg.selected'),
  }

  // アスペクト比をレスポンシブ対応、aspectRatio属性の設定値を返す
  // 縦1の時の横の指定, see: https://fullcalendar.io/docs/aspectRatio
  const { bp, isDown } = useBreakpoint()

  const setAspectRatio = () => {
    switch (bp) {
      case 'xs':
        return 2
      case 'sm':
        return 1.35
      case 'md':
        return 2
      case 'lg':
      case 'xl':
        return 2
      default:
        return 2
    }
  }

  // navigationMenuの開閉に応じてカレンダーをリサイズを更新するため処理
  const animationDuration = 300
  const { isNavigationMenuOpen } = useLayout()
  const [isResizing, setIsResizing] = useState(false)
  const previouslyOpen = useRef(isNavigationMenuOpen)

  useEffect(() => {
    // タブレット以下ではNavigationMenuはオーバーレイ表示なのでカレンダーのリサイズは発生しない
    if (isDown.md) return

    // 前回開閉状態と比較するロジックを用いて、メニュー開閉以外でのリサイズを防ぐ
    if (previouslyOpen.current === isNavigationMenuOpen) return
    previouslyOpen.current = isNavigationMenuOpen // 次回の比較用に更新

    setIsResizing(true)
    const api = calendarRef.current?.getApi() // see: https://fullcalendar.io/docs/updateSize
    // 開閉アニメーションの後にサイズを更新
    const timeoutId = setTimeout(() => {
      api?.updateSize()
      setTimeout(() => setIsResizing(false), 200) // 余韻を持たせる
    }, animationDuration + 200) // 動作安定化のために200msの余裕を持たせる

    return () => clearTimeout(timeoutId)
  }, [isDown.md, isNavigationMenuOpen])

  const states: CalendarStates = {
    calendarRef,
    scrollJudgeElementRef,
    events: calendarEvents,
    selectedEvent,
    isResizing,
    currentMonth,
  }

  const actions: CalendarActions = {
    handleDateClick,
    handleDatesSet,
    setAspectRatio,
    handleDayCellClassNames,
    headerHandlers: {
      handlePrevMonthClick,
      handleTodayClick,
      handleNextMonthClick,
    },
  }

  return <CalendarPresenter states={states} actions={actions} />
}

export default CalendarContainer
