import { ReactNode, useState } from 'react'
import { getFormattedToday } from '../../shared/utils/formatting'
import { AppContext } from '../../shared/hooks/useContexts'
import { useMediaQuery } from '@mui/material'

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(getFormattedToday())
  const isDownLaptop = useMediaQuery((theme) => theme.breakpoints.down('lg'))
  const [isNavigationMenuOpen, setIsNavigationMenuOpen] = useState(isDownLaptop ? false : true)

  const value = {
    currentMonth,
    setCurrentMonth,
    selectedDay,
    setSelectedDay,
    isNavigationMenuOpen,
    setIsNavigationMenuOpen,
    isDownLaptop,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider
