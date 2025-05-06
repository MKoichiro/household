// PortalContext.tsx
import { ReactNode, useCallback, useState } from 'react'
import { PortalEntry, PortalEntriesContext } from '../../../shared/hooks/useContexts'
import { DEFAULT_ENTRIES } from './constant'

const PortalEntriesProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<PortalEntry[]>(DEFAULT_ENTRIES)

  const addEntries = useCallback((newEntries: PortalEntry[]) => {
    setEntries((prev) => {
      const map = new Map<string, PortalEntry[][0]>()
      // まず古いエントリを登録
      prev.forEach((e) => map.set(e.name, e))
      // 次に新しいエントリで上書き
      newEntries.forEach((e) => map.set(e.name, e))
      // 最後に値だけ配列化
      return Array.from(map.values())
    })
  }, [])

  const removeEntry = useCallback((entryName: string) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.name !== entryName))
  }, [])

  const value = {
    entries,
    addEntries,
    removeEntry,
  }

  return (
    <>
      <PortalEntriesContext.Provider value={value}>{children}</PortalEntriesContext.Provider>
    </>
  )
}

export default PortalEntriesProvider
