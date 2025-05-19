import { IconButton, useMediaQuery } from '@mui/material'
import { useLayout } from '../../../shared/hooks/useContexts'
import { useNews } from '../../../shared/hooks/useNews'
import { useEffect } from 'react'
import { FlowingText } from '../../common/FlowingText/FlowingText'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { purple } from '@mui/material/colors'
import { headerNewsHeight } from '../../../shared/constants/ui'
import { CloseIcon, FiberNewIcon, FirstPageIcon } from '../../../icons'
import useFlowingText from '../../common/FlowingText/useFlowingText'

const NewsBar = () => {
  const { isNewsOpen, handleNewsOpen, handleNewsClose } = useLayout()
  const { news, loading } = useNews()
  const isDownLG = useMediaQuery((theme) => theme.breakpoints.down('lg'))

  const register = useFlowingText({
    textContent: news[0]?.description.plain,
    styleWithFixedWidth: {
      maxWidth: '90%',
      padding: '0 1rem 0 0.5rem',
    },
    pxPerSec: 180,
    spacerWidth: 64,
    trigger: isDownLG ? 'click' : 'hover',
    flowAfter: isDownLG ? undefined : 300,
  })

  const { handleReset, isDirty } = register

  // 初回ロード時にnewsステートがセットされたらニュースを開く
  useEffect(() => {
    if (loading || news.length === 0) return
    handleNewsOpen()
  }, [news, loading, handleNewsOpen])

  return (
    <NewsBarRoot className="news" $isNewsOpen={isNewsOpen}>
      {isDirty ? (
        <ResetButton className="flowing-text-reset-btn" type="button" aria-label="リセットボタン" onClick={handleReset}>
          <FirstPageIcon />
        </ResetButton>
      ) : (
        <FiberNewIcon
          sx={{ ml: '0.5rem', height: '100%', width: `calc(${headerNewsHeight}px - 0.5rem)`, padding: '0.3rem' }}
        />
      )}
      <FlowingText {...register} />
      <NavLink to="news" style={{ marginLeft: '1rem', color: 'inherit', flexShrink: 0 }} replace={false}>
        <small> {news.length > 1 ? `他 ${news.length - 1} 件` : '詳細'} </small>
      </NavLink>
      <IconButton
        color="inherit"
        aria-label="お知らせを閉じるボタン"
        onClick={handleNewsClose}
        sx={{ mr: 1, ml: 'auto', px: 1, display: 'flex', alignItems: 'center' }}
      >
        <CloseIcon />
      </IconButton>
    </NewsBarRoot>
  )
}

export default NewsBar

const NewsBarRoot = styled.div<{ $isNewsOpen: boolean }>`
  font-size: 1.6rem;
  background-color: ${purple[100]};
  color: ${purple[900]};
  height: ${headerNewsHeight}px;
  line-height: ${headerNewsHeight}px;
  display: flex;
  transform: translateY(${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '-100%')});

  /* 閉じた後にスクロールバウンスでちらつくので、不可視化 */
  visibility: ${({ $isNewsOpen }) => ($isNewsOpen ? 'visible' : 'hidden')};

  transition:
    transform 300ms ease,
    visibility 0 linear ${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '300ms')};
`

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  height: 100%;
  aspect-ratio: 1 / 1;
  background: transparent;
  color: ${purple[900]};

  svg {
    display: block;
    padding: 0.3rem;
    width: inherit;
    height: inherit;
  }
`
