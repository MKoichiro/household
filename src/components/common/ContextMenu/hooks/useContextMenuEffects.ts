import { useEffect } from 'react'

import type {
  ContextMenuPositionConfig,
  ContextMenuPositionConfigs,
  UseContextMenusEffectsArgs,
} from '@components/common/ContextMenu/types'
import { useClickAway } from '@shared/hooks/useClickAway'
import { useResizeEffects } from '@shared/hooks/useResizeEffects'
import { debounce } from '@shared/utils/debounce'

/**
 * @internal
 * useEffect内の共通処理をまとめた関数。
 */
const collectSpecificIds = (
  configs: ContextMenuPositionConfigs,
  filterFunc: (id: string, config: ContextMenuPositionConfig) => boolean
) => {
  return Object.entries(configs)
    .filter(([id, config]) => filterFunc(id, config))
    .map(([id]) => id)
}

/**
 * @internal
 * ContextMenu に関連する副作用をまとめて実行するフック。
 *
 * @param ids - コンテキストメニューの ID の配列
 * @param idKey - ids の一意性を保証するためのキー
 * @param positionConfigs - 各コンテキストメニューの位置設定
 * @param normCoords - 正規化された座標
 * @param anchorsRef - 各コンテキストメニューのアンカー要素の ref
 * @param idOpenMap - コンテキストメニューの開閉状態を管理するマップ
 * @param idOpenDispatch - コンテキストメニューの開閉状態を更新するためのディスパッチャー
 * @param rootsRef - 各コンテキストメニューのルート要素の ref
 * @param clickAwaySetRef - クリックアウェイ除外リストの ref
 * @param handleCloseAll - 全メニューを閉じるための関数
 * @param dispatchClickPosition - クリック位置を更新するためのディスパッチャー
 * @param dispatchAnchorPosition - アンカー位置を更新するためのディスパッチャー
 * @param considerDefault - デフォルトの設定を考慮するためのオブジェクト
 * @returns なし
 */
const useContextMenuEffects = ({
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
}: UseContextMenusEffectsArgs) => {
  // 1. メニュー設定の変更に応じて idOpenMap を同期
  /* eslint-disable-next-line react-hooks/exhaustive-deps */ // ids の代わりに プリミティブ型の idKey
  useEffect(() => idOpenDispatch({ type: 'SYNC_CONFIGS', ids }), [idKey])

  // 2. 余白のクリックで全メニューを閉じるイベントリスナーを登録
  // 要素ではなく、要素を返す関数を渡すことで、フック内で最新情報を使用させないと、初期は null なのでうまくいかない。
  const rootRefs = ids.map((id) => () => rootsRef.current[id])
  const clickAwaySet = [...clickAwaySetRef.current].map((el) => () => el)
  const anyOpen = Object.values(idOpenMap).some((v: boolean) => v)
  // document のクリックで全メニューを閉じるが、第一引数で指定した要素の中でクリックされた場合は無視する
  useClickAway(
    [...rootRefs, ...clickAwaySet],
    () => {
      if (considerDefault.closeOnClickAway()) {
        handleCloseAll()
      }
    },
    {
      skipCondition: !anyOpen, // true ならイベントリスナーを登録しない
    }
  )

  // 3. クリックモードのresizeイベントリスナー
  useEffect(() => {
    // クリックモードを持つ id がなければ何もしない
    const clickedIds = collectSpecificIds(positionConfigs, (_id, config) => config.mode.main === 'clicked')
    if (clickedIds.length === 0) return
    // ひとつも開いていないなら何もしない
    const anyOpen = Object.values(idOpenMap).some((v: boolean) => v)
    if (!anyOpen) return

    const onResize = debounce(() => {
      clickedIds.forEach((id) => {
        const coord = normCoords?.[id]
        if (coord) dispatchClickPosition(id, coord)
      })
    }, 50)
    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey, normCoords, idOpenMap])

  // 3. アンカーモードの resize イベントリスナー
  useEffect(() => {
    const anchorIds = collectSpecificIds(positionConfigs, (_id, config) => config.mode.main === 'anchor')
    if (anchorIds.length === 0) return
    const anyOpen = Object.values(idOpenMap).some((v: boolean) => v)
    if (!anyOpen) return

    const onResize = debounce(() => anchorIds.forEach((id) => dispatchAnchorPosition(id)), 50)
    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey, idOpenMap])

  // 4. アンカーモードの場合には、anchorElementの要素のサイズ変化を監視
  const anchorTargets = Object.fromEntries(
    Object.entries(positionConfigs)
      .filter(([, config]) => config.mode.main === 'anchor')
      .map(([id]) => [id, () => anchorsRef.current[id]])
  ) as Record<string, () => HTMLElement | null>
  // useResizeEffects: 第一引数のRefObjectまたは要素を返す関数、第二引数は第一引数から得られる要素のリサイズで実行する副作用
  useResizeEffects(anchorTargets, (_el, id) => dispatchAnchorPosition(id))
}

export default useContextMenuEffects
