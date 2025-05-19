// テキストが親要素からはみ出す場合のみに、電光掲示板のように文字を流す汎用コンポーネント
// スタート、一時停止、前回停止位置からのリスタート、初期位置へのリセットに対応
// 再レンダリング頻度は低め（アニメーション中は発生しない）なので現状メモ化はしていない。

import FirstPageIcon from '@mui/icons-material/FirstPage'
import {
  FlowingTextContainer,
  FlowingTextCopy,
  FlowingTextDummy,
  FlowingTextOriginal,
  FlowingTextRoot,
  ResetButton,
} from './styles'
import { FlowingTextProps } from './types'

export const FlowingText = ({
  textContent,
  styleWithFixedWidth,
  x,
  isDirty,
  isOverflow,
  spacerWidth,
  resetButton,
  containerWidthRef,
  dummyWidthRef,
  handleReset,
  handleClick,
  handleMouseEnter,
  handleMouseLeave,
}: FlowingTextProps) => {
  return (
    <FlowingTextRoot
      className="flowing-text-root"
      $isOverflow={isOverflow}
      style={{ ...styleWithFixedWidth }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {resetButton && (
        <ResetButton
          className="flowing-text-reset-btn"
          type="button"
          aria-label="リセットボタン"
          $show={isDirty}
          $side={resetButton}
          onClick={handleReset}
        >
          <FirstPageIcon />
        </ResetButton>
      )}

      {/* 実際に動く要素 */}
      <FlowingTextContainer
        className="flowing-text-container"
        ref={containerWidthRef}
        $spacerWidth={spacerWidth}
        style={{ x }}
      >
        {/* 「オリジナル」 */}
        <FlowingTextOriginal className="flowing-text original" $isOverflow={isOverflow} $isDirty={isDirty}>
          {textContent}
        </FlowingTextOriginal>
        {/* 「コピー」: 全体が空白になるタイミングが無いように、スペーサー ＋ コピーを追従させる */}
        {isDirty && <FlowingTextCopy className="flowing-text copy">{textContent}</FlowingTextCopy>}
      </FlowingTextContainer>

      {/* 「ダミー」: width 計測用 */}
      <FlowingTextDummy className="flowing-text dummy" ref={dummyWidthRef}>
        {textContent}
      </FlowingTextDummy>
    </FlowingTextRoot>
  )
}
