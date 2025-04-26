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
      width: 0;
      height: 0;
      background: #18ffff;
    }
    40% {
      width: 16px;
      height: 16px;
      background: #d500f9;
    }
    80% {
      width: 0;
      height: 0;
      background: #18ffff;
    }
  }

  div:nth-of-type(2) span,
  div:nth-of-type(4) span {
    animation-delay: 150ms;
  }

  div:nth-of-type(3) span,
  div:nth-of-type(5) span,
  div:nth-of-type(7) span {
    animation-delay: 300ms;
  }

  div:nth-of-type(6) span,
  div:nth-of-type(8) span {
    animation-delay: 450s;
  }

  div:nth-of-type(9) span {
    animation-delay: 600ms;
  }
`
