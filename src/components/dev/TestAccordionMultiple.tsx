import styled from '@emotion/styled'
import { useAccordions } from '../../hooks/useAccordion'
import { BareAccordionHead, BareAccordionContent } from '../common/Accordion'

const AccordionHead = styled(BareAccordionHead)`
  cursor: pointer;
  background-color: lightblue;
`

const AccordionContent = styled(BareAccordionContent)<{ $isOpen: boolean; $height: number }>`
  overflow: hidden;
  transition: height 0.3s ease-in-out;
  outline: 1px solid red;
  height: ${({ $isOpen, $height }) => ($isOpen ? `${$height}px` : '0')};
`

const FirstHead = styled.div``

const FirstContent = styled.p``

const SecondContent = styled.p``

// 使用例
const TestAccordionMultiple = () => {
  // 今回は複数のhead-contentペアがある例
  const {
    contentRefs,
    isOpens,
    contentHeights,

    // どちらかを使う
    // toggle,        // 指定したindexのコンテンツを開閉
    controlledToggle, // 他のセクションを閉じて、指定したセクションだけを開く

    // 必要に応じてopen(index)やclose(index)で開く・閉じる
    // open,
    // close,
  } = useAccordions(5, false) // セクション数と初期値を指定、初期値はboolean[]もサポート

  const {
    contentRefs: innerContentRefs,
    isOpens: innerIsOpens,
    contentHeights: innerContentHeights,
    toggle: innerToggle,
  } = useAccordions(3, [false, true, true]) // セクション数と初期値を指定、初期値はboolean[]もサポート

  return (
    <div>
      <AccordionHead role="button" tabIndex={0} onClick={controlledToggle(0)}>
        <FirstHead>First Head</FirstHead>
      </AccordionHead>

      <AccordionContent ref={contentRefs[0]} $isOpen={isOpens[0]} $height={contentHeights[0]}>
        <FirstContent>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, cumque? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil porro
          voluptatum eos ab dolor illo aperiam consectetur saepe nobis cupiditate sint ut labore expedita, enim
          asperiores iusto! Deleniti, fugit et.
        </FirstContent>
      </AccordionContent>

      {/* buttonを自前で用意する例 */}
      <AccordionHead style={{ backgroundColor: 'lightgreen' }}>
        <h2>Second Head</h2>
        <button type="button" onClick={controlledToggle(1)}>
          Toggle
        </button>
      </AccordionHead>

      <AccordionContent ref={contentRefs[1]} $isOpen={isOpens[1]} $height={contentHeights[1]}>
        <SecondContent>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, cumque? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil porro
          voluptatum eos ab dolor illo aperiam consectetur saepe nobis cupiditate sint ut labore expedita, enim
          asperiores iusto! Deleniti, fugit et. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, cumque?
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil porro
          voluptatum eos ab dolor illo aperiam consectetur saepe nobis cupiditate sint ut labore expedita, enim
          asperiores iusto! Deleniti, fugit et.
        </SecondContent>
      </AccordionContent>

      {/* レンダー要素の変更 */}
      <AccordionHead style={{ margin: 0 }} component="h2" role="button" tabIndex={0} onClick={controlledToggle(2)}>
        Third Head
      </AccordionHead>
      <AccordionContent ref={contentRefs[2]} $isOpen={isOpens[2]} $height={contentHeights[2]}>
        <textarea style={{ width: '100%', height: '100%' }} />
      </AccordionContent>

      {/* アコーディオンの入れ子 */}
      <AccordionHead style={{ margin: 0 }} component="h2" role="button" tabIndex={0} onClick={controlledToggle(3)}>
        forth Head
      </AccordionHead>
      <AccordionContent ref={contentRefs[3]} $isOpen={isOpens[3]} $height={contentHeights[3]}>
        {/* 内側のアコーディオン */}
        <h3>Inner Accordions</h3>
        <AccordionHead style={{ margin: 0 }} component="h2" role="button" tabIndex={0} onClick={innerToggle(0)}>
          inner Head 1
        </AccordionHead>
        <AccordionContent ref={innerContentRefs[0]} $isOpen={innerIsOpens[0]} $height={innerContentHeights[0]}>
          <p>インナーコンテンツ1</p>
        </AccordionContent>
        <AccordionHead style={{ margin: 0 }} component="h2" role="button" tabIndex={0} onClick={innerToggle(1)}>
          inner Head 2
        </AccordionHead>
        <AccordionContent ref={innerContentRefs[1]} $isOpen={innerIsOpens[1]} $height={innerContentHeights[1]}>
          <p>インナーコンテンツ2</p>
        </AccordionContent>
        <AccordionHead style={{ margin: 0 }} component="h2" role="button" tabIndex={0} onClick={innerToggle(2)}>
          inner Head 3
        </AccordionHead>
        <AccordionContent ref={innerContentRefs[2]} $isOpen={innerIsOpens[2]} $height={innerContentHeights[2]}>
          <p>インナーコンテンツ3</p>
        </AccordionContent>
      </AccordionContent>
    </div>
  )
}

export default TestAccordionMultiple
