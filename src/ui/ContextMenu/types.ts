import type { Variants } from 'framer-motion'
import type {
  ActionDispatch,
  CSSProperties,
  Dispatch,
  MouseEventHandler,
  ReactNode,
  Ref,
  RefObject,
  SetStateAction,
} from 'react'

/**
 * 位置情報に関する top, left, right, bottom [px]と、transform。
 */
export type PositionStyle = {
  top?: number | 'auto'
  left?: number | 'auto'
  right?: number | 'auto'
  bottom?: number | 'auto'
  transform?: CSSProperties['transform']
}

/**
 * メニュー位置計算で使用するオフセット量や正規化座標を表現。px 単位。
 */
export interface Coordinate {
  /** x 座標 [px] */
  x: number
  /** y 座標 [px] */
  y: number
}

/**
 * 'clicked' モードで、基準とするモノを指定。
 */
export type ClickMode = 'window' | 'document' | 'anchor'

/**
 * 'custom' モードで、CSS で位置を決定する際の基準を指定。
 */
export type CustomMode = 'document' | 'window'

/**
 * 位置決定のモードを表す列挙型。
 */
export type Mode = { main: 'custom'; sub: CustomMode } | { main: 'clicked'; sub: ClickMode } | { main: 'anchor' }

/**
 * アンカー要素に対するサブメニューの相対配置を示す列挙型。
 */
export type AnchorRelativity =
  | 'none'
  | 'innerCenter'
  | 'innerTopCenter'
  | 'innerRightCenter'
  | 'innerBottomCenter'
  | 'innerLeftCenter'
  | 'innerTopLeftCorner'
  | 'innerTopRightCorner'
  | 'innerBottomLeftCorner'
  | 'innerBottomRightCorner'
  | 'outerTopLeft'
  | 'outerTopCenter'
  | 'outerTopRight'
  | 'outerRightTop'
  | 'outerRightCenter'
  | 'outerRightBottom'
  | 'outerBottomLeft'
  | 'outerBottomCenter'
  | 'outerBottomRight'
  | 'outerLeftTop'
  | 'outerLeftCenter'
  | 'outerLeftBottom'
  | 'outerTopLeftCorner'
  | 'outerTopRightCorner'
  | 'outerBottomLeftCorner'
  | 'outerBottomRightCorner'
  | 'boundaryTop'
  | 'boundaryRight'
  | 'boundaryBottom'
  | 'boundaryLeft'

/**
 * clicked モードでクリックした位置に展開するとき、カーソルがメニューのどの位置かを示す列挙型。
 */
export type CursorRelativity =
  | 'topLeft'
  | 'topCenter'
  | 'topRight'
  | 'rightCenter'
  | 'bottomRight'
  | 'bottomCenter'
  | 'bottomLeft'
  | 'leftCenter'
  | 'center'

/**
 * custom モードで、CSS で位置を決定する際の基準を示す列挙型。
 */
export type CustomRelativity = 'documentTopLeft' | 'windowTopLeft'

/**
 * @internal
 * AnchorRelativity をキーとし、DOMRect から座標を計算する関数マップ。
 */
export type AnchorModePositionCalculators = Record<
  AnchorRelativity,
  ((rect: DOMRect) => Coordinate) | (() => Coordinate)
>

/**
 * @internal
 * 相対オフセットを計算する関数マップのキー。
 */
type OffsetAlias = 'start' | 'center' | 'end'

/**
 * @internal
 * 相対オフセットを計算する関数マップ。
 */
export type OffsetMap = Record<OffsetAlias, (rect: DOMRect) => number>

/**
 * @internal
 * clicked モード時の正規化座標からメニュー表示位置を計算する関数マップ。
 */
export type ClickedModePositionCalculators = Record<
  ClickMode,
  ((normCoord: Coordinate | null) => Coordinate) | ((normCoord: Coordinate | null, anchorRect?: DOMRect) => Coordinate)
>

/**
 * サブメニューの位置決定戦略を示す型。
 */
export interface SubMenuPosition {
  /**
   * 'absoluteTop': ルート要素の上端と揃える
   * 'parentTop': 親メニュー項目の上端と揃える
   * 'parentCenter': 親メニュー項目の中心と揃える
   */
  strategy: 'absoluteTop' | 'parentTop' | 'parentCenter'
  /** strategy で決定した位置からの追加 y オフセット(px) */
  offsetY?: number
}

/**
 * アンカー要素を基準にメニューを表示する場合の位置決定戦略の詳細。
 */
export interface Anchor {
  type: 'anchor'
  /** アンカー要素からの相対位置を決める指定。 */
  anchorRelativity?: AnchorRelativity
  /** 計算結果からさらにずらす量。 */
  offset?: Coordinate
}
/**
 * clicked モードで、クリックした位置にメニューを表示する場合の位置決定戦略の詳細。
 */
export interface Clicked {
  type: 'clicked'
  /** 展開操作のクリックイベントが発生した位置にルートメニューを表示する指定。'window' か 'document' か 'anchor' か、基準を選択して表示できる。 */
  clicked: ClickMode
  /** 展開時に、カーソル位置をメニューのどの部分とするか */
  cursorRelativity?: CursorRelativity
  /** 計算結果からさらにずらす量。 */
  offset?: Coordinate
}
/**
 * 自前の CSS でメニューを表示する場合の位置決定戦略。
 */
export interface Custom {
  type: 'custom'
  /** CSS で位置を決定する際の基準。'documentTopLeft' は document の左上、'windowTopLeft' は window の左上を基準とする。 */
  customRelativity?: CustomRelativity
  /** 自前の CSS で document の左上基準から決定する */
  custom?: PositionStyle
}
/**
 * コンテキストメニューを表示する際の位置決定の戦略を示す型。
 */
export type PositionStrategy = Anchor | Clicked | Custom

/**
 * @internal
 * 内部処理用に変換した位置設定。
 */
export interface PositionConfig {
  anchorRelativity?: AnchorRelativity
  cursorRelativity?: CursorRelativity
  offset: Coordinate
  customPos?: PositionStyle
  mode: Mode
}

type Register = Omit<ContextMenuProps, 'positionStyle' | 'open'>

export interface ContextMenuInstance {
  open: boolean
  positionStyle: PositionStyle
  /** ContextMenu コンポーネントにスプレッドする Props */
  register: Register
  /** anchor 要素登録のための ref callback */
  anchorRef: (el: HTMLElement | null) => void
  /** click-away 除外要素の登録のための ref */
  clickAwayRef: (el: HTMLElement | null) => void
  /** コンテキストメニューのtoggle 処理を行う関数 */
  handleToggle: MouseEventHandler<unknown>
  /** コンテキストメニューを開く関数 */
  handleOpen: MouseEventHandler<unknown>
  /** コンテキストメニューを閉じる関数 */
  handleClose: MouseEventHandler<unknown>
}

type HandlerMap = (id: string) => MouseEventHandler<unknown>

/**
 * useContextMenus の返り値の型。
 */
export interface ContextMenusInstance {
  opens: Record<string, boolean>
  positionStyles: PositionStyles
  /** commonConfig を統合し、id が保証された configs */
  integratedConfigs: ContextMenusConfigsWithId
  /** ContextMenu コンポーネントにスプレッドする Props */
  registers: Record<string, Register>
  /** anchor 要素登録のための ref callback */
  anchorRefs: Record<string, (el: HTMLElement | null) => void>
  /** click-away 除外要素の登録のための ref */
  clickAwayRef: (el: HTMLElement | null) => void
  /** コンテキストメニューのtoggle 処理を行う関数 */
  handleToggle: HandlerMap
  /** 展開時に他のコンテキストメニューを閉じて toggle 処理を行う関数 */
  controlledToggle: HandlerMap
  /** コンテキストメニューを開く関数 */
  handleOpen: HandlerMap
  /** 他のコンテキストメニューを閉じて該当のコンテキストメニューを開く関数 */
  controlledOpen: HandlerMap
  /** コンテキストメニューを閉じる関数 */
  handleClose: HandlerMap
  /** 展開中のすべてのコンテキストメニューを一括で閉じる関数 */
  handleCloseAll: () => void
}

/**
 * @internal
 * ContextMenuPositionConfigs の value の型。
 */
export interface ContextMenuPositionConfig {
  customPos?: PositionStyle
  mode: Mode
  offset: Coordinate
  cursorRelativity?: CursorRelativity
  anchorRelativity?: AnchorRelativity
}

/**
 * @internal
 * rawConfigs の内、position を整形した positionConfigs の型。
 */
export type ContextMenuPositionConfigs = {
  [id: string]: ContextMenuPositionConfig
}

// useContextMenuStates
/**
 * @internal
 * IdOpenMap のステートの型。
 */
export type IdOpenMap = Record<string, boolean>

/**
 * @internal
 * IdOpenMap の reducer 用アクション型。
 */
export type IdOpenMapAction =
  | { type: 'OPEN'; id: string }
  | { type: 'CLOSE'; id: string }
  | { type: 'CLOSE_ALL' }
  | { type: 'CONTROLLED_OPEN'; id: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'CONTROLLED_TOGGLE'; id: string }
  | { type: 'SYNC_CONFIGS'; ids: string[] }

/**
 * @internal
 * PositionStyles のステートの型。
 */
export type PositionStyles = Record<string, PositionStyle>

/**
 * @internal
 * PositionStyles の reducer 用アクションの型。
 */
export type PositionStylesAction =
  | { id: string; type: 'CUSTOM'; customPos: PositionStyle }
  | {
      id: string
      type: 'CLICK'
      normCoord: Coordinate
      offset: Coordinate
      cursorRelativity?: CursorRelativity
      clickMode: ClickMode
      anchorRect?: DOMRect
    }
  | { id: string; type: 'ANCHOR'; offset: Coordinate; anchorRelativity?: AnchorRelativity; anchorRect: DOMRect }

/**
 * @internal
 * useContextMenuStates の引数の型。
 */
export interface UseContextMenuStatesArgs {
  configs: ContextMenusConfigs
  positionConfigs: ContextMenuPositionConfigs
  commonConfig?: ContextMenusCommonConfig
}

/**
 * @internal
 * useContextMenuStates の返り値の型。
 */
export interface UseContextMenuStatesReturns {
  idOpenMap: IdOpenMap
  positionStyles: PositionStyles
  normCoords: Record<string, Coordinate>
  idOpenDispatch: Dispatch<IdOpenMapAction>
  positionStylesDispatch: Dispatch<PositionStylesAction>
  setNormCoords: Dispatch<SetStateAction<Record<string, Coordinate>>>
}

// useContextMenuRefs
/**
 * @internal
 * useContextMenuRefs の引数の型。
 */
export interface UseContextMenuRefsArgs {
  ids: string[]
  idKey: string
}

/**
 * @internal
 * useContextMenuRefs の返り値の型。
 */
export interface UseContextMenuRefsReturns {
  /** すべてのコンテキストメニューのアンカー要素を保持する ref object */
  anchorsRef: RefObject<Record<string, HTMLElement | null>>
  /** それぞれのコンテキストメニューのアンカー要素を anchorsRef に登録するための ref callback */
  anchorCallbacks: Record<string, (el: HTMLElement | null) => void>
  /** click-away 除外対象要素の Set を保持する ref */
  clickAwaySetRef: RefObject<Set<HTMLElement>>
  /** click-away 除外対象要素を clickAwaySetRef に登録するための ref callback */
  clickAwayCallbacks: (el: HTMLElement | null) => void
  /** すべてのコンテキストメニューのルート要素を保持する ref object */
  rootsRef: RefObject<Record<string, HTMLDivElement | null>>
  /** それぞれのコンテキストメニューのルート要素を rootsRef に登録するための ref callback */
  rootCallbacks: Record<string, (el: HTMLDivElement | null) => void>
}

// useContextMenuHandlers
/**
 * @internal
 * useContextMenuHandlers の引数の型。
 */
export interface UseContextMenuHandlersArgs {
  positionConfigs: ContextMenuPositionConfigs
  anchorsRef: RefObject<Record<string, HTMLElement | null>>
  positionStylesDispatch: ActionDispatch<[action: PositionStylesAction]>
  setNormCoords: Dispatch<SetStateAction<Record<string, Coordinate>>>
  idOpenDispatch: ActionDispatch<[action: IdOpenMapAction]>
}

/**
 * @internal
 * useContextMenuHandlers の返り値の型。
 */
export interface UseContextMenuHandlersReturns {
  dispatchClickPosition: (id: string, normCoord: Coordinate) => void
  dispatchAnchorPosition: (id: string) => void
  handleOpen: (id: string) => MouseEventHandler<unknown>
  controlledOpen: (id: string) => MouseEventHandler<unknown>
  handleToggle: (id: string) => MouseEventHandler<unknown>
  controlledToggle: (id: string) => MouseEventHandler<unknown>
  handleClose: (id: string) => MouseEventHandler<unknown>
  handleCloseAll: () => void
}

// useContextMenusEffects
export interface DefaultSettings {
  menuTree: (raw?: ContextMenuConfig['menuTree']) => ContextMenuProps['menuTree']
  animeConfigs: (raw?: ContextMenuConfig['animeConfigs']) => ContextMenuProps['animeConfigs']
  autoIcon: (raw?: ContextMenuConfig['autoIcon']) => ContextMenuProps['autoIcon']
  toLeft: (raw?: ContextMenuConfig['direction']) => ContextMenuProps['toLeft']
  shouldFix: (mode: Mode) => ContextMenuProps['shouldFix']
  zIndex: (raw?: ContextMenuConfig['zIndex']) => ContextMenuProps['zIndex']
  open: (raw?: ContextMenuConfig['open']) => ContextMenuProps['open']
  position: (raw?: ContextMenuConfig['position']) => PositionConfig
  subMenuPosition: (raw?: ContextMenuConfig['subMenuPosition']) => ContextMenuProps['subMenuPosition']
  closeOnClickAway: () => boolean
}
/**
 * @internal
 * useContextMenusEffects の引数の型。
 */
export interface UseContextMenusEffectsArgs {
  ids: string[]
  idKey: string
  positionConfigs: ContextMenuPositionConfigs
  normCoords: Record<string, Coordinate>
  anchorsRef: RefObject<Record<string, HTMLElement | null>>
  idOpenMap: Record<string, boolean>
  idOpenDispatch: ActionDispatch<[action: IdOpenMapAction]>
  rootsRef: RefObject<Record<string, HTMLElement | null>>
  clickAwaySetRef: RefObject<Set<HTMLElement>>
  handleCloseAll: () => void
  dispatchClickPosition: (id: string, normCoord: Coordinate) => void
  dispatchAnchorPosition: (id: string) => void
  considerDefault: DefaultSettings
}

// export interface UseContextMenusEffectsReturn { 無し }

/**
 * メニュー項目を表すツリー構造の型。ネストされたサブメニューは children で再帰的に定義。
 */
export interface MenuTree {
  /** メニュー項目の一意な識別子 */
  id?: string
  /** 表示する内容。ReactNode 型で、文字列や JSX 要素を指定可能 */
  display: ReactNode
  /** display が（子孫にわたって）button 要素を含むかどうか。自動判定も行われるが、css-in-js や mui コンポーネントなどを display で渡す場合に、nested button のコンソールエラーが出る場合は明示すること。 */
  includeButton?: boolean
  /** children を持つ MenuTree の場合に、展開示唆のための ">" アイコンを自動付与するかどうかの個別指定。ContextMenu から一括指定も可能 */
  autoIcon?: boolean
  /** 同じ MenuTree 型のネストされるサブメニュー（あれば） */
  children?: MenuTree[]
  /** ネストされた children オブジェクトで true とする場合は先祖すべても open を指定すること */
  open?: boolean
  /** divider を直後に表示する指定 */
  dividerAfter?: boolean
}

/**
 * @internal
 * 内部処理用に id を必ず持つ型。
 */
export type MenuTreeWithId = Required<Pick<MenuTree, 'id'>> & Omit<MenuTree, 'id'> & { children?: MenuTreeWithId[] }

/**
 * useContextMenu(s) 引数の共通設定基底型。
 */
export interface ContextMenuConfigBase {
  /** メニューの内容を表すオブジェクトのツリー構造を表す配列。 */
  menuTree?: MenuTree[]
  /** framer-motion の設定を含む、アニメーション設定。 */
  animeConfigs?: AnimeConfigs
  /** children を持つ MenuTreeの場合に、展開示唆のための ">" アイコンを自動付与するかどうかの一括指定。menuTreeの中でも個別に指定が可能。 */
  autoIcon?: boolean
  /** サブメニューの展開方向。デフォルトは 'left'。 */
  direction?: 'left' | 'right'
  /** メニューの位置を決定するための戦略。 */
  position?: PositionStrategy
  /** */
  subMenuPosition?: SubMenuPosition
  /** メニューの z-index。デフォルトは 1000。 */
  zIndex?: CSSProperties['zIndex']
  /** 初回レンダリング時の開閉状態。デフォルトは false。 */
  open?: boolean
}

/**
 * useContextMenu"s" に渡す引数。共通設定用。
 */
export interface ContextMenusCommonConfig extends ContextMenuConfigBase {
  /** 余白のクリックで閉じるかどうか */
  closeOnClickAway?: boolean
}

/**
 * @internal
 *  useContextMenu"s" に渡す引数の型、ContextMenusConfigs の要素の型。
 */
export interface ContextMenusConfig extends ContextMenuConfigBase {
  /** コンテキストメニューの ID。ユニークである必要がある。指定しなければ自動生成される。 */
  id?: string
  /** 内部的には使用されない。使用者がわかりやすさのために付与する属性。 */
  name?: string
}

/**
 * useContextMenu に渡す引数。共通設定がない分、closeOnClickAway も指定可能にする。
 */
export interface ContextMenuConfig extends ContextMenusConfig {
  /** 余白のクリックで閉じるかどうか */
  closeOnClickAway?: boolean
}

/**
 * useContextMenu"s" に渡す引数。個別設定用。
 */
export type ContextMenusConfigs = ContextMenusConfig[]

type WithId<T extends { id?: string }> = Omit<T, 'id'> & Required<Pick<T, 'id'>>
/**
 * id の存在を保証した型。ContextMenuConfigRaw 型の引数を変換し、内部処理はこちらの型のデータとして行う。
 */
export type ContextMenusConfigsWithId = WithId<ContextMenusConfig>[]

export interface AnimeConfig {
  /** アニメーションの variants。 */
  variants: Variants
  /** 初期状態を表す variants のキー。 */
  initial: Extract<keyof Variants, string>
  /** アニメーション後の状態を表す variants のキー。 */
  animate: Extract<keyof Variants, string>
  /** 終了状態を表す variants のキー。 */
  exit: Extract<keyof Variants, string>
  /** transform-origin の指定。 */
  transformOrigin?: string
}
/**
 * ContextMenu のアニメーション設定。framer-motionを使用。Variants の型は、framer-motion の Variants 型を使用。
 */
export interface AnimeConfigs {
  /** ルートメニューのアニメーション設定。 */
  root: AnimeConfig
  /** サブメニューのアニメーション設定。 */
  sub: AnimeConfig
}

/**
 * ContextMenu コンポーネントの props 型定義。基本は useContextMenu の返り値 register をスプレッドすることで指定される。
 */
export interface ContextMenuProps {
  /** styled-components でスタイルのオーバーライドを可能にする */
  className?: string
  /** コンテキストメニューの ID。 */
  id: string
  /** framer-motion の設定を含む、アニメーション設定。 */
  animeConfigs: AnimeConfigs
  /** コンテキストメニューの開閉状態。 */
  open: boolean
  /** メニューの内容を表すオブジェクトのツリー構造を表す配列。 */
  menuTree: MenuTreeWithId[]
  /** 子を持つ MenuTree の場合に、展開示唆のための ">" アイコンを自動付与するかどうかの一括指定。menuTreeの中でも個別に指定が可能。 */
  autoIcon: boolean
  /** ルート要素の参照。 */
  rootRef: (el: HTMLDivElement | null) => void
  /** サブメニューの展開方向。デフォルトは 'left'。 */
  toLeft: boolean
  /** ルートメニューのポジション制御のための CSSProperties。 */
  positionStyle: PositionStyle
  /** サブメニューの位置決定戦略。 */
  subMenuPosition: SubMenuPosition
  /** position: fixed か position: absolute か。clicked かつ 'window' の場合に true。 */
  shouldFix: boolean
  /** ルート要素の z-index。デフォルトは 1000。 */
  zIndex: CSSProperties['zIndex']
  /** ルート要素のスタイル。必要があれば。基本は className ベースでの適用を推奨。 */
  style?: CSSProperties
}

/**
 * @internal
 * Nested コンポーネントの props 型定義。
 */
export interface NestedProps {
  /** 自身以下のmenuTree */
  menuTree: MenuTreeWithId[]
  /** framer-motion の設定を含む、アニメーション設定。 */
  animeConfig: AnimeConfig
  /** サブメニューの展開方向 */
  toLeft: boolean
  /** autoIconの一括指定。 */
  autoIconBulk: boolean
  /** サブメニューの位置決定戦略。 */
  subMenuPosition: SubMenuPosition
}

/**
 * @internal
 * Nested コンポーネントで使用する MenuTree からのシャローコピーの型定義。
 */
export interface MenuItem {
  /** メニュー項目の ID。 */
  id: string
  /** 表示する内容。 */
  display: ReactNode
  /** display が（子孫にわたって）button 要素を含むかどうか。自動判定も行われるが、css-in-js や mui コンポーネントなどを display で渡す場合は明示すること。 */
  includeButton?: boolean
  /** children属性が定義されているかどうか。 */
  hasChildren: boolean
  /** サブメニューの開閉状態 */
  open: boolean
  /** children を持つ MenuTree の場合に、展開示唆のための ">" アイコンを自動付与するかどうかの個別指定。ContextMenu から一括指定も可能 */
  autoIcon: boolean
  /** divider を直後に表示する指定 */
  dividerAfter: boolean
}

/**
 * @internal
 * MenuContext コンポーネントの props 型定義。
 */
export interface MenuContentProps {
  /** メニューの項目の ID。 */
  id: string
  /** 親のul要素のref。サブメニューの位置計算に使用。 */
  ref: Ref<HTMLLIElement | null>
  /** 表示する内容。displayで指定される値 */
  content: ReactNode
  /** display が（子孫にわたって）button 要素を含むかどうか。自動判定も行われるが、css-in-js や mui コンポーネントなどを display で渡す場合は明示すること。 */
  includeButton?: boolean
  /** children属性が定義されているかどうか。 */
  hasChildren: boolean
  /** children を持つ MenuTree の場合に、展開示唆のための ">" アイコンを自動付与するかどうかの個別指定。ContextMenu から一括指定も可能 */
  autoIcon: boolean
  /** divider を直後に表示する指定 */
  dividerAfter: boolean
  /** サブメニューの開閉操作のハンドラ */
  onClick?: () => void
  /** サブメニューの展開操作、他は閉じる処理を含む。 */
  onMouseEnter?: () => void
  /** サブメニューの開閉操作のハンドラ */
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void
}

/**
 * @internal
 * MotionContext コンポーネントの props 型。
 */
export interface MotionContextProps {
  /** コンテキストメニューまたはメニューの項目の ID。framer-motionの仕様上必須。 */
  id: string
  animeConfig: AnimeConfig
  toLeft: boolean
  style?: CSSProperties
  children: ReactNode
}
