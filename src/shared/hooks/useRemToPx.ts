import { useBreakpoint } from './useBreakpoint'
import { htmlFontSizes } from '../../styles/constants'

export const useRemToPx = () => {
  const currentBP = useBreakpoint()
  const convertRate = (htmlFontSizes[currentBP] / 100) * 16
  return { remToPx: (rem: number): number => rem * convertRate }
}
