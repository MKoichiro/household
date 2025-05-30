import type {
  OffsetMap,
  CursorRelativity,
  AnchorRelativity,
  Coordinate,
  AnchorModePositionCalculators,
  ClickedModePositionCalculators,
} from './types'

// "v"ertical（縦）方向は３パターン
const v: OffsetMap = {
  start: (r) => r.top + window.scrollY, // メニュー上端とrect上端 （がそろう）
  center: (r) => r.top + window.scrollY + r.height / 2, // メニュー上端とrect中央
  end: (r) => r.bottom + window.scrollY, // メニュー上端とrect下端
}

// "h"orizontal（横）方向は３パターン
const h: OffsetMap = {
  start: (r) => r.left + window.scrollX, // メニュー左端とrect左端
  center: (r) => r.left + window.scrollX + r.width / 2, // メニュー左端とrect中央
  end: (r) => r.right + window.scrollX, // メニュー左端とrect右端
}

/**
 * @internal
 * メニューの各 AnchorRelativity ごとに DOMRect から座標を計算するマップ。
 */
export const anchorModePositionCalculators: AnchorModePositionCalculators = {
  // ■ 相対位置を指定しない場合のデフォルト位置
  none: () => ({ y: 0, x: 0 }),

  // ■ 内側ど真ん中
  innerCenter: (r) => ({ y: v.center(r), x: h.center(r) }),

  // ■ 「内側から」「接する辺の」「真ん中」
  innerTopCenter: (r) => ({ y: v.start(r), x: h.center(r) }),
  innerRightCenter: (r) => ({ y: v.center(r), x: h.end(r) }),
  innerBottomCenter: (r) => ({ y: v.end(r), x: h.center(r) }),
  innerLeftCenter: (r) => ({ y: v.center(r), x: h.start(r) }),

  // ■ 内側コーナー
  innerTopLeftCorner: (r) => ({ y: v.start(r), x: h.start(r) }),
  innerTopRightCorner: (r) => ({ y: v.start(r), x: h.end(r) }),
  innerBottomLeftCorner: (r) => ({ y: v.end(r), x: h.start(r) }),
  innerBottomRightCorner: (r) => ({ y: v.end(r), x: h.end(r) }),

  // ■ 「外側から」「接する辺」「揃える方向」
  // 上の辺
  outerTopLeft: (r) => ({ y: v.start(r), x: h.start(r) }),
  outerTopCenter: (r) => ({ y: v.start(r), x: h.center(r) }),
  outerTopRight: (r) => ({ y: v.start(r), x: h.end(r) }),
  // 右の辺
  outerRightTop: (r) => ({ y: v.start(r), x: h.end(r) }),
  outerRightCenter: (r) => ({ y: v.center(r), x: h.end(r) }),
  outerRightBottom: (r) => ({ y: v.end(r), x: h.end(r) }),
  // 下の辺
  outerBottomRight: (r) => ({ y: v.end(r), x: h.end(r) }),
  outerBottomLeft: (r) => ({ y: v.end(r), x: h.start(r) }),
  outerBottomCenter: (r) => ({ y: v.end(r), x: h.center(r) }),
  // 左の辺
  outerLeftBottom: (r) => ({ y: v.end(r), x: h.start(r) }),
  outerLeftCenter: (r) => ({ y: v.center(r), x: h.start(r) }),
  outerLeftTop: (r) => ({ y: v.start(r), x: h.start(r) }),

  // ■ 外側コーナー
  outerTopLeftCorner: (r) => ({ y: v.start(r), x: h.start(r) }),
  outerTopRightCorner: (r) => ({ y: v.start(r), x: h.end(r) }),
  outerBottomRightCorner: (r) => ({ y: v.end(r), x: h.end(r) }),
  outerBottomLeftCorner: (r) => ({ y: v.end(r), x: h.start(r) }),

  // ■ 辺上をまたぐ配置
  boundaryTop: (r) => ({ y: v.start(r), x: h.center(r) }),
  boundaryRight: (r) => ({ y: v.center(r), x: h.end(r) }),
  boundaryBottom: (r) => ({ y: v.end(r), x: h.center(r) }),
  boundaryLeft: (r) => ({ y: v.center(r), x: h.start(r) }),
}

/**
 * @internal
 * 正規化された座標を元に、クリックされた位置を document 上の絶対座標計算するマップ。
 */
const clickedModePositionCalculators: ClickedModePositionCalculators = {
  anchor: (normCoord: Coordinate | null, anchorRect?: DOMRect) => {
    if (!anchorRect || !normCoord) {
      if (import.meta.env.MODE !== 'production') {
        console.warn('anchorRect or normCoord is falsy')
      }
      return { x: 0, y: 0 }
    }
    const { x, y } = normCoord
    // anchor からの相対座標を計算
    const anchorY = anchorRect.height * y
    const anchorX = anchorRect.width * x
    // window からの相対座標を計算
    const windowY = anchorRect.top + anchorY
    const windowX = anchorRect.left + anchorX
    // document 上の絶対座標を計算
    const documentY = windowY + window.scrollY
    const documentX = windowX + window.scrollX
    return { x: documentX, y: documentY }
  },
  window: (normCoord: Coordinate | null) => {
    if (!normCoord) {
      if (import.meta.env.MODE !== 'production') {
        console.warn('normCoord is falsy')
      }
      return { x: 0, y: 0 }
    }
    const { x, y } = normCoord
    const windowY = window.innerHeight * y
    const windowX = window.innerWidth * x
    return { x: windowX, y: windowY }
  },
  document: (normCoord: Coordinate | null) => {
    if (!normCoord) {
      if (import.meta.env.MODE !== 'production') {
        console.warn('normCoord is falsy')
      }
      return { x: 0, y: 0 }
    }
    const { x, y } = normCoord
    const windowY = window.innerHeight * y
    const windowX = window.innerWidth * x
    const documentY = windowY + window.scrollY
    const documentX = windowX + window.scrollX
    return { x: documentX, y: documentY }
  },
}

// AnchorRelativity を CSS transform 値にマッピング。
const anchorRelativityToTF: Record<AnchorRelativity, string> = {
  // ■ 相対位置を指定しない場合のデフォルト位置
  none: 'none',

  // ■ 内側ど真ん中
  innerCenter: 'translate(-50%,-50%)',

  // ■ 「内側から」「接する辺の」「真ん中」
  innerTopCenter: 'translate(-50%,0)',
  innerRightCenter: 'translate(-100%,-50%)',
  innerBottomCenter: 'translate(-50%,-100%)',
  innerLeftCenter: 'translate(0,-50%)',

  // ■ 内側コーナー
  innerTopLeftCorner: 'none',
  innerTopRightCorner: 'translate(-100%,0)',
  innerBottomLeftCorner: 'translate(0,-100%)',
  innerBottomRightCorner: 'translate(-100%,-100%)',

  // ■ 「外側から」「接する辺」「揃える方向」
  // 上の辺
  outerTopLeft: 'translate(-100%,0)',
  outerTopCenter: 'translate(-50%,-100%)',
  outerTopRight: 'translate(-100%,-100%)',
  // 右の辺
  outerRightTop: 'none',
  outerRightCenter: 'translate(0,-50%)',
  outerRightBottom: 'translate(0,-100%)',
  // 下の辺
  outerBottomRight: 'translate(-100%,0)',
  outerBottomLeft: 'none',
  outerBottomCenter: 'translate(-50%,0)',
  // 左の辺
  outerLeftBottom: 'translate(-100%,-100%)',
  outerLeftCenter: 'translate(-100%,-50%)',
  outerLeftTop: 'translate(-100%,0)',

  // ■ 外側コーナー
  outerTopLeftCorner: 'translate(-100%,-100%)',
  outerTopRightCorner: 'translate(0,-100%)',
  outerBottomRightCorner: 'none',
  outerBottomLeftCorner: 'translate(-100%,0)',

  // ■ 辺上をまたぐ配置
  boundaryTop: 'translate(-50%,-50%)',
  boundaryRight: 'translate(-50%,-50%)',
  boundaryBottom: 'translate(-50%,-50%)',
  boundaryLeft: 'translate(-50%,-50%)',
}

// CursorRelativity を CSS transform 値にマッピング。
const cursorRelativityToTF: Record<CursorRelativity, string> = {
  topLeft: 'none',
  topCenter: 'translate(-50%,0)',
  topRight: 'translate(-100%,0)',
  rightCenter: 'translate(-100%,-50%)',
  bottomRight: 'translate(-100%,-100%)',
  bottomCenter: 'translate(-50%,-100%)',
  bottomLeft: 'translate(0,-100%)',
  leftCenter: 'translate(0,-50%)',
  center: 'translate(-50%,-50%)',
}

// Relativity が AnchorRelativity か CursorRelativity を判定するための型ガード。
const isAnchorRelativity = (type: string): type is AnchorRelativity => {
  return Object.keys(anchorModePositionCalculators).includes(type)
}

/**
 * @internal
 * AnchorRelativity または CursorRelativity から CSS transform 値を返却。
 *
 * @param aries - AnchorRelativity | CursorRelativity | undefined
 * @returns CSS transform の文字列
 */
const relativityToTransform = (aries: AnchorRelativity | CursorRelativity | undefined) => {
  if (!aries) return anchorRelativityToTF.none
  if (isAnchorRelativity(aries)) {
    return anchorRelativityToTF[aries]
  } else {
    return cursorRelativityToTF[aries]
  }
}

/**
 * @internal
 * ベース座標にオフセットを適用します。
 *
 * @param coord - 元の座標
 * @param offset - 加算するオフセット量
 * @returns 新しい座標オブジェクト
 */
const addOffset = (coord: Coordinate, offset: Coordinate) => {
  const adjustedY = coord.y + offset.y
  const adjustedX = coord.x + offset.x
  return { y: adjustedY, x: adjustedX }
}

/**
 * コンテキストメニューの position 計算のためのユーティリティ関数をまとめたオブジェクト。
 */
const positionCalculators = {
  anchor: anchorModePositionCalculators,
  clicked: clickedModePositionCalculators,
  addOffset,
  relativityToTransform,
}

export default positionCalculators
