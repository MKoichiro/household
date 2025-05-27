import { type Variants } from 'framer-motion'

import type { AnimeConfigs } from './types'

const variantsMap: Record<string, Variants> = {
  scale: {
    hidden: { scale: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
    animate: { scale: 1, transition: { duration: 0.2, ease: 'easeInOut' } },
  },
}

export const defaultAnimeConfigs: AnimeConfigs = {
  root: {
    variants: variantsMap.scale,
    initial: 'hidden',
    animate: 'animate',
    exit: 'hidden',
    transformOrigin: 'center',
  },
  sub: {
    variants: variantsMap.scale,
    initial: 'hidden',
    animate: 'animate',
    exit: 'hidden',
  },
}
