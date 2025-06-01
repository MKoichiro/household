import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { AppContext } from '@shared/hooks/useContexts'
import { getFormattedToday } from '@shared/utils/formatting'

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [homeMonth, setHomeMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(getFormattedToday())

  useEffect(() => {
    const savedMonth = localStorage.getItem('homeMonth')
    if (savedMonth) {
      setHomeMonth(new Date(savedMonth))
    }
  }, [])

  const value = {
    homeMonth,
    setHomeMonth,
    selectedDay,
    setSelectedDay,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider
