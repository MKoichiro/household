import { useMemo } from 'react'
import {
  ContextMenuConfig,
  ContextMenuPositionConfigs,
  ContextMenusInstance,
  ContextMenuInstance,
  ContextMenusConfigs,
  ContextMenusCommonConfig,
  ContextMenusConfigsWithId,
  ContextMenusConfig,
  MenuTreeWithId,
} from '../types'
import { orDefault } from './defaultConfigs'
import useContextMenuStates from './useContextMenuStates'
import useContextMenuRefs from './useContextMenuRefs'
import useContextMenuHandlers from './useContextMenuHandlers'
import useContextMenuEffects from './useContextMenuEffects'

/**
 * @internal
 * id の存在・一意性を保証するガード
 * rawConfigs に対して必ず一意の id を補完し、重複を警告します。
 * @param rawConfigs - ユーザー定義の ContextMenuConfigRaw 配列
 * @returns id が保証された ContextMenuConfig 配列
 */
const idGuard = (rawConfigs: ContextMenusConfigs): { idAssuredConfigs: ContextMenusConfigsWithId } => {
  // 存在の保証
  const configsWithId = rawConfigs.map<ContextMenusConfig>((config) => ({
    ...config,
    id: config.id ?? crypto.randomUUID(),
  })) as ContextMenusConfigsWithId

  // 一意性の保証
  const ids = configsWithId.map((config) => config.id)
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate ContextMenu IDs found: ${duplicateIds.join(', ')}`)
  }

  return { idAssuredConfigs: configsWithId }
}

/**
 * 複数のコンテキストメニューを統括して管理するためのフック。
 *
 * @param rawConfigs - それぞれのコンテキストメニューの個別設定配列
 * @param commonConfig - すべてのコンテキストメニューで共通の設定
 * @returns 返り値はコンテキストメニュー操作用の各種オブジェクトとハンドラを含むオブジェクト
 */
export const useContextMenus = (
  rawConfigs: ContextMenusConfigs,
  commonConfig?: ContextMenusCommonConfig
): ContextMenusInstance => {
  const { idAssuredConfigs: configs } = useMemo(() => idGuard(rawConfigs), [rawConfigs])
  // orDefault 内部の menuTree のコピーが重くなる可能性があるのでメモ化
  const considerDefault = useMemo(() => orDefault(commonConfig), [commonConfig])
  const ids = useMemo(() => configs.map(({ id }) => id), [configs])
  const idKey = useMemo(() => configs.map(({ id }) => id).join(','), [configs])
  const positionConfigs = Object.fromEntries(
    configs.map(({ id, position }) => [id, considerDefault.position(position)])
  ) as ContextMenuPositionConfigs

  // States
  const { idOpenMap, positionStyles, normCoords, idOpenDispatch, positionStylesDispatch, setNormCoords } =
    useContextMenuStates({ configs, positionConfigs, commonConfig })

  // Refs
  const { anchorsRef, anchorCallbacks, clickAwaySetRef, clickAwayCallbacks, rootsRef, rootCallbacks } =
    useContextMenuRefs({ ids, idKey })

  // Handlers
  const {
    dispatchClickPosition,
    dispatchAnchorPosition,
    handleOpen,
    controlledOpen,
    handleToggle,
    controlledToggle,
    handleClose,
    handleCloseAll,
  } = useContextMenuHandlers({
    positionConfigs,
    anchorsRef,
    positionStylesDispatch,
    setNormCoords,
    idOpenDispatch,
  })

  // Effects
  useContextMenuEffects({
    ids,
    idKey,
    positionConfigs,
    normCoords,
    anchorsRef,
    idOpenMap,
    idOpenDispatch,
    rootsRef,
    clickAwaySetRef,
    handleCloseAll,
    dispatchClickPosition,
    dispatchAnchorPosition,
    considerDefault,
  })

  // NOTE: configs の id が使用者によって明示されていない場合、considerDefault.menuTree(menuTree) で id の再割り当てが行われる。
  // これにより複数展開時に最後以外に展開したコンテキストメニューのサブメニューが展開できない不具合が起こる。
  // これを避けるため、idKey の必要最低限の変更でメモ化する。
  // positionConfigs, registerMapのメモ化、依存配列でも対処可能だが、クリティカルなこの処理を分離した。
  const menuTree: MenuTreeWithId[][] = useMemo(
    () => configs.map(({ menuTree }) => considerDefault.menuTree(menuTree)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [idKey]
  )

  // フックの配布物なので参照安定性のためにメモ化
  const registerMap = useMemo(() => {
    const map: ContextMenusInstance['registers'] = {}
    configs.forEach(({ id, animeConfigs, autoIcon, direction, zIndex, subMenuPosition }, i) => {
      const mode = positionConfigs[id].mode
      map[id] = {
        id,
        animeConfigs: considerDefault.animeConfigs(animeConfigs),
        menuTree: menuTree[i],
        autoIcon: considerDefault.autoIcon(autoIcon),
        toLeft: considerDefault.toLeft(direction),
        rootRef: rootCallbacks[id],
        subMenuPosition: considerDefault.subMenuPosition(subMenuPosition),
        shouldFix: considerDefault.shouldFix(mode),
        zIndex: considerDefault.zIndex(zIndex),
      }
    })
    return map
  }, [configs, considerDefault, menuTree, positionConfigs, rootCallbacks])

  return {
    /** [ステート] コンテキストメニューの開閉状態の id マッピング */
    opens: idOpenMap,
    /** [ステート] コンテキストメニューの位置を表現するスタイルの id マッピング */
    positionStyles,
    /** commonConfig を統合し、id が保証された configs */
    integratedConfigs: configs,
    /** ContextMenu コンポーネントにスプレッドする Props */
    registers: registerMap,
    /** anchor 要素登録のための ref callback */
    anchorRefs: anchorCallbacks,
    /** click-away 除外要素の登録のための ref */
    clickAwayRef: clickAwayCallbacks,
    /** コンテキストメニューのtoggle 処理を行う関数 */
    handleToggle,
    /** 展開時に他のコンテキストメニューを閉じて toggle 処理を行う関数 */
    controlledToggle,
    /** コンテキストメニューを開く関数 */
    handleOpen,
    /** 他のコンテキストメニューを閉じて該当のコンテキストメニューを開く関数 */
    controlledOpen,
    /** コンテキストメニューを閉じる関数 */
    handleClose,
    /** 展開中のすべてのコンテキストメニューを一括で閉じる関数 */
    handleCloseAll,
  }
}

/**
 * 単一のコンテキストメニューを扱うためのラッパーフック。
 *
 * @param rawConfig - ユーザー定義の ContextMenuConfigRaw
 * @returns
 */
export const useContextMenu = (rawConfig: ContextMenuConfig): ContextMenuInstance => {
  const copy = { ...rawConfig }
  const { closeOnClickAway } = copy
  const commonConfig = { closeOnClickAway }
  delete copy.closeOnClickAway
  const rawConfigs: ContextMenusConfigs = [copy]

  const { idAssuredConfigs: configs } = idGuard(rawConfigs)
  const { opens, positionStyles, registers, anchorRefs, clickAwayRef, handleToggle, handleOpen, handleClose } =
    useContextMenus(configs, commonConfig)
  const { id } = configs[0]

  return {
    /** コンテキストメニューの開閉状態 */
    open: opens[id],
    /** コンテキストメニューの位置を表現するスタイル */
    positionStyle: positionStyles[id],
    /** ContextMenu コンポーネントにスプレッドする Props */
    register: registers[id],
    /** anchor 要素登録のための ref callback */
    anchorRef: anchorRefs[id],
    /** click-away 除外要素の登録のための ref */
    clickAwayRef,
    /** コンテキストメニューのtoggle 処理を行う関数 */
    handleToggle: handleToggle(id),
    /** コンテキストメニューを開く関数 */
    handleOpen: handleOpen(id),
    /** コンテキストメニューを閉じる関数 */
    handleClose: handleClose(id),
  }
}
