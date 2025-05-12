import { MotionContextProps } from './types'
import { MotionContextBase } from './styled'

const MotionContext = ({ id, animeConfig, toLeft = true, style, children }: MotionContextProps) => {
  const { transformOrigin, ...rest } = animeConfig
  return (
    <MotionContextBase
      key={id}
      {...rest}
      $toLeft={toLeft}
      $transformOrigin={transformOrigin ? transformOrigin : toLeft ? 'top right' : 'top left'}
      style={style}
    >
      {children}
    </MotionContextBase>
  )
}

export default MotionContext
