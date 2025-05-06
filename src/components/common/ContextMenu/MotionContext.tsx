import styled from '@emotion/styled'
import { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { AnimeConfigs } from './animationConfigs'

interface MotionContextProps {
  id: string
  animeConfigs: AnimeConfigs
  toLeft: boolean
  style?: CSSProperties
  children: ReactNode
}

const MotionContext = ({ id, animeConfigs, toLeft = true, style, children }: MotionContextProps) => {
  return (
    <MotionContextBase key={id} {...animeConfigs} $toLeft={toLeft} style={style}>
      {children}
    </MotionContextBase>
  )
}

const MotionContextBase = styled(motion.div)<{ $toLeft: boolean }>`
  display: flex;
  transform-origin: ${({ $toLeft }) => ($toLeft ? 'top right' : 'top left')};
  flex-direction: ${({ $toLeft }) => ($toLeft ? 'row-reverse' : 'row')};
`

export default MotionContext
