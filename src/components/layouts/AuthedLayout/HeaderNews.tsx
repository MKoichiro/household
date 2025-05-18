import { IconButton, useMediaQuery } from '@mui/material'
import { useLayout } from '../../../shared/hooks/useContexts'
import { useNews } from '../../../shared/hooks/useNews'
import { useEffect } from 'react'
import FlowingText from '../../common/FlowingText'
import { NavLink } from 'react-router-dom'
import styled from '@emotion/styled'
import { purple } from '@mui/material/colors'
import { headerNewsHeight } from '../../../shared/constants/ui'
import { CloseIcon } from '../../../icons'

const NewsBar = () => {
  const { isNewsOpen, handleNewsOpen, handleNewsClose } = useLayout()
  const { news, loading } = useNews()
  const isDownLG = useMediaQuery((theme) => theme.breakpoints.down('lg'))

  // 初回ロード時にnewsステートがセットされたらニュースを開く
  useEffect(() => {
    if (loading || news.length === 0) return
    handleNewsOpen()
  }, [news, loading, handleNewsOpen])

  return (
    <NewsBarRoot className="news" $isNewsOpen={isNewsOpen}>
      <FlowingText
        textContent={news[0]?.description.plain}
        pxPerSec={180}
        spacerWidth={64}
        flowAfter={isDownLG ? undefined : 300}
        trigger={isDownLG ? 'click' : 'hover'}
        styleWithFixedWidth={{
          maxWidth: '90%',
          padding: '0.25rem 1rem',
        }}
      />
      <NavLink to="news" style={{ marginLeft: '0.5rem', color: 'inherit', flexShrink: 0 }} replace={false}>
        <small>（ {news.length > 1 ? `他 ${news.length - 1} 件` : '詳細'} ）</small>
      </NavLink>
      <IconButton
        color="inherit"
        aria-label="close news"
        edge="start"
        onClick={handleNewsClose}
        sx={{
          mr: 1,
          ml: 'auto',
          px: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CloseIcon />
      </IconButton>
    </NewsBarRoot>
  )
}

export default NewsBar

const NewsBarRoot = styled.div<{ $isNewsOpen: boolean }>`
  background-color: ${purple[100]};
  color: ${purple[900]};
  height: ${headerNewsHeight}px;
  display: flex;
  transform: translateY(${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '-100%')});

  /* 閉じた後にスクロールバウンスでちらつくので、不可視化 */
  visibility: ${({ $isNewsOpen }) => ($isNewsOpen ? 'visible' : 'hidden')};

  transition:
    transform 300ms ease,
    visibility 0 linear ${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '300ms')};
`
