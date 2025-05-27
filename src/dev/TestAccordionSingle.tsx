import styled from '@emotion/styled'

import { BareAccordionHead, BareAccordionContent } from '@components/common/Accordion'
import { useAccordion } from '@shared/hooks/useAccordion'

const AccordionHead = styled(BareAccordionHead)`
  background-color: lightblue;
`

const AccordionContent = styled(BareAccordionContent)<{ $open: boolean; $height: number }>`
  cursor: pointer;
  overflow: hidden;
  transition: height 300ms ease-in-out;
  background-color: lightblue;
  height: ${({ $open, $height }) => ($open ? `${$height}px` : '0')};
`

// 使用例
const TestAccordionSingle = () => {
  // 単一で使用する場合は専用のuseAccordionを使う
  const {
    contentRef,
    isOpen,
    contentHeight,
    toggle,
    // 必要なら。外部からの制御も可能。
    // open,
    // close,
  } = useAccordion(true)

  return (
    <>
      <AccordionHead open={isOpen} component="h3" role="button" tabIndex={0} onClick={toggle}>
        Accordion Head
      </AccordionHead>

      <AccordionContent ref={contentRef} $open={isOpen} $height={contentHeight}>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, cumque? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Quas, cumque? Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil porro
          voluptatum eos ab dolor illo aperiam consectetur saepe nobis cupiditate sint ut labore expedita, enim
          asperiores iusto! Deleniti, fugit et.
        </p>
      </AccordionContent>
    </>
  )
}

export default TestAccordionSingle
