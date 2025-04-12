import { ReactNode, useState } from 'react'
import { useMediaQuery } from '@mui/material'
import { theme } from '../theme/theme'
import { getFormattedToday } from '../utils/formatting'
import { AppContext } from '../hooks/useContexts'

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(getFormattedToday())
  const [isSideBarOpen, setIsSideBarOpen] = useState(true)
  const isUnderLG = useMediaQuery(theme.breakpoints.down('lg')) // 副作用: windowオブジェクトを操作

  const value = {
    currentMonth,
    setCurrentMonth,
    selectedDay,
    setSelectedDay,
    isSideBarOpen,
    setIsSideBarOpen,
    isUnderLG,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppProvider
