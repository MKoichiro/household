import styled from '@emotion/styled'

import { useAccordions } from '@shared/hooks/useAccordion'
import { BareAccordionHead, BareAccordionContent } from '@ui/Accordion'

const AccordionHead = styled(BareAccordionHead)`
  cursor: pointer;
  background-color: lightblue;
`

const AccordionContent = styled(BareAccordionContent)<{ $open: boolean; $height: number }>`
  overflow: hidden;
  transition: height 300ms ease-in-out;
  outline: 1px solid red;
  height: ${({ $open, $height }) => ($open ? `${$height}px` : '0')};
`

const FirstHead = styled.div``

const FirstContent = styled.p``

const SecondContent = styled.p``

// 使用例
const TestAccordionMultiple = () => {
  // 現状問題ないが、無限ループが生じる場合には
  // デフォルトの状態はなるべくコンポーネント外で定義する
  const OUTER_DEFAULTS = {
    'outer-0': false,
    'outer-1': true,
    'outer-2': false,
    'outer-3': false,
    'outer-4': false,
  }

  const INNER_DEFAULTS = {
    'inner-0': false,
    'inner-1': true,
    'inner-2': false,
  }
  const {
    contentRefs: outerContentRefs,
    accordions: outerAccordions,
    controlledToggle: outerControlledToggle,

    // 必要に応じてopen(id)やclose(id)で開く・閉じる
    // open,
    // close,
  } = useAccordions(OUTER_DEFAULTS)

  const {
    contentRefs: innerContentRefs,
    accordions: innerAccordions,

    toggle: innerToggle,
  } = useAccordions(INNER_DEFAULTS)

  return (
    <div>
      <AccordionHead
        open={outerAccordions['outer-0'].open}
        // 省略可
        // role="button"
        // tabIndex={0}
        // onKeyDown={
        //   outerAccordions['outer-0'].open
        //     ? undefined
        //     : (e: React.KeyboardEvent<HTMLDivElement>) => {
        //         if (e.key === 'Enter' || e.key === ' ') {
        //           outerControlledToggle('outer-0')()
        //         }
        //       }
        // }
        onClick={outerControlledToggle('outer-0')}
      >
        <FirstHead>First Head</FirstHead>
      </AccordionHead>

      <AccordionContent
        ref={outerContentRefs['outer-0']}
        $open={outerAccordions['outer-0'].open}
        $height={outerAccordions['outer-0'].height}
      >
        {/* アコーディオンのコンテンツ */}
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
      <AccordionHead open={outerAccordions['outer-1'].open} style={{ backgroundColor: 'lightgreen' }}>
        <h2>Second Head</h2>
        <button type="button" onClick={outerControlledToggle('outer-1')}>
          Toggle
        </button>
      </AccordionHead>

      <AccordionContent
        ref={outerContentRefs['outer-1']}
        $open={outerAccordions['outer-1'].open}
        $height={outerAccordions['outer-1'].height}
      >
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
      <AccordionHead
        open={outerAccordions['outer-2'].open}
        style={{ margin: 0 }}
        component="h2"
        role="button"
        tabIndex={0}
        onClick={outerControlledToggle('outer-2')}
      >
        Third Head
      </AccordionHead>
      <AccordionContent
        ref={outerContentRefs['outer-2']}
        $open={outerAccordions['outer-2'].open}
        $height={outerAccordions['outer-2'].height}
      >
        <textarea style={{ width: '100%', height: '100%' }} />
      </AccordionContent>

      {/* アコーディオンの入れ子 */}
      <AccordionHead
        open={outerAccordions['outer-3'].open}
        style={{ margin: 0 }}
        component="h2"
        role="button"
        tabIndex={0}
        onClick={outerControlledToggle('outer-3')}
      >
        forth Head
      </AccordionHead>
      <AccordionContent
        ref={outerContentRefs['outer-3']}
        $open={outerAccordions['outer-3'].open}
        $height={outerAccordions['outer-3'].height}
      >
        {/* 内側のアコーディオン */}
        <h3>Inner Accordions</h3>
        <AccordionHead
          open={innerAccordions['inner-0'].open}
          style={{ margin: 0 }}
          component="h2"
          role="button"
          tabIndex={0}
          onClick={innerToggle('inner-0')}
        >
          inner Head 1
        </AccordionHead>
        <AccordionContent
          ref={innerContentRefs['inner-0']}
          $open={innerAccordions['inner-0'].open}
          $height={innerAccordions['inner-0'].height}
        >
          <p>インナーコンテンツ1</p>
        </AccordionContent>
        <AccordionHead
          open={innerAccordions['inner-1'].open}
          style={{ margin: 0 }}
          component="h2"
          role="button"
          tabIndex={0}
          onClick={innerToggle('inner-1')}
        >
          inner Head 2
        </AccordionHead>
        <AccordionContent
          ref={innerContentRefs['inner-1']}
          $open={innerAccordions['inner-1'].open}
          $height={innerAccordions['inner-1'].height}
        >
          <p>インナーコンテンツ2</p>
        </AccordionContent>
        <AccordionHead
          open={innerAccordions['inner-2'].open}
          style={{ margin: 0 }}
          component="h2"
          role="button"
          tabIndex={0}
          onClick={innerToggle('inner-2')}
        >
          inner Head 3
        </AccordionHead>
        <AccordionContent
          ref={innerContentRefs['inner-2']}
          $open={innerAccordions['inner-2'].open}
          $height={innerAccordions['inner-2'].height}
        >
          <p>インナーコンテンツ3</p>
        </AccordionContent>
      </AccordionContent>
    </div>
  )
}

export default TestAccordionMultiple
