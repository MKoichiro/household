import styled from '@emotion/styled'

const LoadingOverlay = ({ isLoading = true }: { isLoading?: boolean }) => {
  if (!isLoading) return null

  return (
    <StyledDiv>
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index}>
          <span />
        </div>
      ))}
    </StyledDiv>
  )
}

export default LoadingOverlay

const StyledDiv = styled.div`
  width: 60px;
  height: 60px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  div {
    width: 20px;
    height: 20px;
    float: left;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    position: relative;
  }

  span {
    position: absolute;
    display: block;
    border-radius: 3px;
    animation: anim 1.2s infinite;
    animation-timing-function: linear;
  }

  @keyframes anim {
    0% {
      width: 0px;
      height: 0px;
      background: #18ffff;
    }
    40% {
      width: 15px;
      height: 15px;
      background: #d500f9;
    }
    80% {
      width: 0px;
      height: 0px;
      background: #18ffff;
    }
  }

  div:nth-child(2) span,
  div:nth-child(4) span {
    animation-delay: 0.15s;
  }

  div:nth-child(3) span,
  div:nth-child(5) span,
  div:nth-child(7) span {
    animation-delay: 0.3s;
  }

  div:nth-child(6) span,
  div:nth-child(8) span {
    animation-delay: 0.45s;
  }

  div:nth-child(9) span {
    animation-delay: 0.6s;
  }
`
