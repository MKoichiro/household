import type { Variants } from 'framer-motion'

const variants: Variants = {
  hidden: { scale: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
  animate: { scale: 1, transition: { duration: 0.2, ease: 'easeInOut' } },
}

export interface AnimeConfigs {
  variants: Variants
  initial: string
  animate: string
  exit: string
}

export const defaultAnimeConfigs: AnimeConfigs = {
  variants,
  initial: 'hidden',
  animate: 'animate',
  exit: 'hidden',
}
