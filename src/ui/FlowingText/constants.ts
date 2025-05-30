import type { UseFlowingTextArg } from './types'

export const defaults: Required<
  Pick<UseFlowingTextArg, 'pxPerSec' | 'spacerWidth' | 'trigger' | 'initializeDuration'>
> = {
  pxPerSec: 100,
  spacerWidth: 32,
  trigger: 'click',
  initializeDuration: 500,
}
