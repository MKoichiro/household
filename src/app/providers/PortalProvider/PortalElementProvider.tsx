// PortalContext.tsx
import type { ReactNode } from 'react'
import { useCallback, useState } from 'react'

import type { PortalElementMap } from '@shared/hooks/useContexts'
import { usePortalEntries, PortalElementContext } from '@shared/hooks/useContexts'

const PortalElementProvider = ({ children }: { children: ReactNode }) => {
  const { entries } = usePortalEntries()

  // useRefを使用すると、レンダリングに関係のないタイミングでセットされるので、動作が安定しない。
  // RefCallback(register())はマウント時に呼ばれるので、useRefよりも確実に値を定義できる。
  const [map, setMap] = useState<PortalElementMap>({}) // { [key: string]: HTMLElement }

  const register = useCallback(
    (name: string) => (el: HTMLElement | null) => {
      if (!el) return
      setMap((prev) => {
        // 新しい要素が登録されたときだけ state を更新
        if (prev[name] === el) return prev
        return { ...prev, [name]: el }
      })
    },
    []
  )

  return (
    <>
      {entries.map(({ name, dataPortal }) => (
        <div key={name} ref={register(name)} data-portal={dataPortal} />
      ))}
      <PortalElementContext.Provider value={map}>{children}</PortalElementContext.Provider>
    </>
  )
}

export default PortalElementProvider
