import type { ReactNode } from 'react'
import { useState } from 'react'

import { AppContext } from '@shared/hooks/useContexts'
import { getFormattedToday } from '@shared/utils/formatting'

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(getFormattedToday())

  const value = {
    currentMonth,
    setCurrentMonth,
    selectedDay,
    setSelectedDay,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider
