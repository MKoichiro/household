import { htmlFontSizes } from '@styles/constants'

import { useBreakpoint } from './useBreakpoint'

export const useRemToPx = () => {
  const { bp: currentBP } = useBreakpoint()
  const convertRate = (htmlFontSizes[currentBP] / 100) * 16
  return { remToPx: (rem: number): number => rem * convertRate }
}
