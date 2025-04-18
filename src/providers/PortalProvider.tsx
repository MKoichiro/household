// PortalContext.tsx
import { ReactNode, useCallback, useState } from 'react'
import { PortalContext, PortalMap } from '../hooks/useContexts'

const PortalProvider = ({ children }: { children: ReactNode }) => {
  const ENTRIES = [
    // タブレット以下でのTransactionのメニュー
    {
      name: 'half-modal',
      dataPortal: 'half-modal',
    },
    // タブレット以下でのTransactionのメニュー
    {
      name: 'modal',
      dataPortal: 'portal-root',
    },

    // 追加する場合はこの下に...
    // { name: '???', dataPortal: '???' },
  ]

  // useRefを使用すると、レンダリングに関係のないタイミングでセットされるので、動作が安定しない。
  // RefCallback(register())はマウント時に呼ばれるので、useRefよりも確実に値を定義できる。
  const [map, setMap] = useState<PortalMap>({})

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
      {ENTRIES.map(({ name, dataPortal }) => (
        <div key={name} ref={register(name)} data-portal={dataPortal} />
      ))}
      <PortalContext.Provider value={map}>{children}</PortalContext.Provider>
    </>
  )
}

export default PortalProvider
