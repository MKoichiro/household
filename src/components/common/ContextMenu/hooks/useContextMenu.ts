import {
  useState,
  useRef,
  RefObject,
  MouseEventHandler,
  useEffect,
  createRef,
  useMemo,
  useCallback,
  MouseEvent,
} from 'react'
import { AnchorRelativity, ClickMode, Coordinate, CursorRelativity, MenuTree, Mode, PositionStyle } from '../types'
import { AnimeConfigs, defaultAnimeConfigs } from '../animationConfigs'
import { useContextMenuPosition, ContextMenuPositionConfigs } from './useContextMenuPosition'
import useClickAway from '../../../../shared/hooks/useClickAway'
import { ContextMenuOriginProps } from '../ContextMenuOrigin'

const defaultProps = {
  animeConfigs: (rawAnimeConfigs?: AnimeConfigs) => rawAnimeConfigs ?? defaultAnimeConfigs,
  autoIcon: (rawAutoIcon?: boolean) => rawAutoIcon ?? false,
  toLeft: (rawDirection?: 'left' | 'right') => (rawDirection ? rawDirection === 'left' : true),
  shouldFix: (mode: Mode) => mode.main === 'clicked' && mode.sub === 'window',
}

// 判別可能なユニオン型（Discriminated Union Types）で定義
interface Anchor {
  type: 'anchor'
  /* アンカー要素からの相対位置を決める指定。 */
  anchorRelativity?: AnchorRelativity
  /* 計算結果からさらにずらす量。 */
  offset?: Coordinate
}
interface Clicked {
  type: 'clicked'
  /* 展開操作のクリックイベントが発生した位置にルートメニューを表示する指定。
    'window' か 'document' か基準を選択して表示できる。 */
  clicked: ClickMode
  /* 展開時に、カーソル位置をメニューのどの部分とするか */
  cursorRelativity?: CursorRelativity
  /* 計算結果からさらにずらす量。 */
  offset?: Coordinate
}
interface Custom {
  type: 'custom'
  /* anchorRef も clicked も指定しない場合、自前の CSS で document の左上基準から決定する */
  custom: PositionStyle
}
type PositionStrategy = Anchor | Clicked | Custom

type PositionConfig = {
  anchorRelativity?: AnchorRelativity
  cursorRelativity?: CursorRelativity
  offset: Coordinate
  customPos?: PositionStyle
  mode: Mode
}

// useContextMenu の引数の position を useContextMenuPosition の引数の形に変換
const normalizePosition = (position: PositionStrategy): PositionConfig => {
  const baseOffset: Coordinate = { x: 0, y: 0 }

  switch (position.type) {
    case 'custom':
      return {
        offset: baseOffset,
        customPos: position.custom,
        mode: { main: 'custom' },
      }
    case 'anchor':
      return {
        anchorRelativity: position.anchorRelativity ?? 'none',
        offset: position.offset ?? baseOffset,
        mode: { main: 'anchor' },
      }
    case 'clicked':
      return {
        cursorRelativity: position.cursorRelativity ?? 'topLeft',
        offset: position.offset ?? baseOffset,
        mode: { main: 'clicked', sub: position.clicked },
      }
    default:
      throw new Error('Invalid position type')
  }
}

export interface ContextMenuConfigs {
  id: string
  animeConfigs?: AnimeConfigs
  menuTree: MenuTree[]
  /* children を持つ MenuTreeの場合に、展開示唆のための ">" アイコンを自動付与するかどうかの一括指定。menuTreeの中でも個別に指定が可能。 */
  autoIcon?: boolean
  /* サブメニューの展開方向。デフォルトは 'left' */
  direction?: 'left' | 'right'
  /* ルートメニューの位置を決めるための指定。 */
  position: PositionStrategy
  /* 初回レンダリング時の開閉状態デフォルトはfalse */
  open?: boolean
}

const useContextMenu = (configs: ContextMenuConfigs[]) => {
  // 直接refを配布仕様とすると、型の制約がきつく汎用性が落ちるので、ref callback によって一律でHTMLElementとして扱う。
  // 現状getBoundingClientRect()しか使わないため、HTMLElement で十分。
  // anchor要素の性質上無いと思うが、例えばHTMLButtonElement固有のel.disabledを使おうとすると問題になるので注意。
  const anchorsRef = useRef<Record<string, HTMLElement | null>>({})
  const anchorCallbacks = useMemo(
    () =>
      Object.fromEntries(
        configs.map(({ id }) => [
          id,
          (el: HTMLElement | null) => {
            if (el) anchorsRef.current[id] = el
            else delete anchorsRef.current[id]
          },
        ])
      ),
    [configs]
  )

  const clickAwaySetRef = useRef<Set<HTMLElement>>(new Set())
  const clickAwayCallbacks = useCallback((el: HTMLElement | null) => {
    if (el) {
      clickAwaySetRef.current.add(el)
    } else {
      // null が来たら全要素から削除 or 個別に remove
      // （個別 remove したい場合は Map<id, el> とかにしても OK）
      clickAwaySetRef.current.clear()
    }
  }, [])

  // 複数 menu の anchor, closeBtn, root 用の ref マップ
  const rootRefs = useRef<Record<string, RefObject<HTMLDivElement | null>>>({})
  // 初期化
  configs.forEach(({ id }) => {
    // id が追加されたら ref を作成
    if (!rootRefs.current[id]) rootRefs.current[id] = createRef<HTMLDivElement>()
  })

  // 開閉状態を id ごとに管理
  const [openStates, setOpenStates] = useState<Record<string, boolean>>(
    // lazy に初回だけ初期化
    () => Object.fromEntries(configs.map(({ id, open }) => [id, open ?? false])) as Record<string, boolean>
  )
  // configs の動的な変更に対応するための useEffect
  useEffect(() => {
    setOpenStates((prev) => {
      const next = { ...prev }
      let changed = false
      configs.forEach(({ id }) => {
        if (!(id in next)) {
          next[id] = false
          changed = true
        }
      })
      return changed ? next : prev
    })
  }, [configs])

  // useContextMenuPosition 用の configs マップを作成
  const positionConfigs: ContextMenuPositionConfigs = {}
  configs.forEach(({ id, position }) => {
    positionConfigs[id] = {
      ...normalizePosition(position),
      anchorElement: anchorsRef.current[id],
    }
  })
  const posResults = useContextMenuPosition(positionConfigs)

  // ハンドラー
  // 1) 開く ＋ 位置調整
  const open = useCallback(
    (id: string) => (e: MouseEvent<unknown>) => {
      // 1. 開く
      setOpenStates((prev) => ({ ...prev, [id]: true }))

      // 2. 位置調整
      const { mode } = normalizePosition(configs.find((a) => a.id === id)!.position)
      if (!openStates[id]) {
        if (mode.main === 'clicked' && mode.sub !== 'anchor') {
          posResults[id].applyPosition(e)
          return
        }
        posResults[id].applyPosition(e)
      }
    },
    [configs, openStates, posResults]
  )
  // 2) 閉じる
  const close = useCallback(
    (id: string) => () => {
      setOpenStates((prev) => ({ ...prev, [id]: false }))
    },
    []
  )
  // 4) 全閉じ
  const closeAll = useCallback(() => {
    setOpenStates((prev) => {
      const next: Record<string, boolean> = {}
      Object.keys(prev).forEach((key) => (next[key] = false))
      return next
    })
  }, [])
  // 3) ひとつだけ開く
  const openOnly = useCallback(
    (id: string) => (e: React.MouseEvent<unknown>) => {
      closeAll()
      open(id)(e)
    },
    [closeAll, open]
  )
  // 5) toggle（単純開閉）
  const toggleMenu = useCallback(
    (id: string) => (e: React.MouseEvent<unknown>) => {
      if (openStates[id]) {
        close(id)()
      } else {
        open(id)(e)
      }
    },
    [openStates, open, close]
  )
  // 6) toggleOnly（他を閉じて開く）
  const toggleOnlyMenu = useCallback(
    (id: string) => (e: React.MouseEvent<unknown>) => {
      if (openStates[id]) {
        closeAll()
      } else {
        openOnly(id)(e)
      }
    },
    [openStates, openOnly, closeAll]
  )

  // ハンドラ用マップ化関数
  const makeHandlerMap = useCallback(
    (fnFactory: (id: string) => MouseEventHandler<unknown>) =>
      Object.fromEntries(configs.map(({ id }) => [id, fnFactory(id)])) as Record<string, MouseEventHandler<unknown>>,
    [configs]
  )

  const handleToggleMap = useMemo(() => makeHandlerMap((id) => toggleMenu(id)), [makeHandlerMap, toggleMenu])
  const handleToggleOnlyMap = useMemo(
    () => makeHandlerMap((id) => toggleOnlyMenu(id)),
    [makeHandlerMap, toggleOnlyMenu]
  )
  const handleOpenMap = useMemo(() => makeHandlerMap((id) => open(id)), [makeHandlerMap, open])
  const handleOpenOnlyMap = useMemo(() => makeHandlerMap((id) => openOnly(id)), [makeHandlerMap, openOnly])
  const handleCloseMap = useMemo(() => makeHandlerMap((id) => close(id)), [makeHandlerMap, close])
  // 全閉じは単体でエクスポート
  const handleCloseAll = closeAll

  // TODO: 余白をクリックして閉じるかどうかはオプションで指定できるようにする -> ref={clickAwayRefs}を付けるかどうかで制御可能なので不要。
  // まとまった clickAway: 全 menu を閉じる
  useClickAway([...Object.values(rootRefs.current), ...[...clickAwaySetRef.current].map((el) => () => el)], closeAll)

  // 登録情報をマップにまとめる
  const registerMap: Record<string, ContextMenuOriginProps> = {}
  configs.forEach(({ id, animeConfigs, menuTree, autoIcon, direction, position }) => {
    const { mode } = normalizePosition(position)
    registerMap[id] = {
      id,
      animeConfigs: defaultProps.animeConfigs(animeConfigs),
      menuTree,
      autoIcon: defaultProps.autoIcon(autoIcon),
      toLeft: defaultProps.toLeft(direction),
      rootRef: rootRefs.current[id],
      positionStyle: posResults[id].positionStyle,
      shouldFix: defaultProps.shouldFix(mode),
      open: openStates[id],
    }
  })

  return {
    register: registerMap,
    anchorRefs: anchorCallbacks,
    handleToggle: handleToggleMap,
    handleToggleOnly: handleToggleOnlyMap,
    handleOpen: handleOpenMap,
    handleOpenOnly: handleOpenOnlyMap,
    handleClose: handleCloseMap,
    handleCloseAll,
    clickAwayRefs: clickAwayCallbacks,
  }
}

export default useContextMenu
