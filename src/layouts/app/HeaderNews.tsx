import styled from '@emotion/styled'
import { IconButton } from '@mui/material'
import type { HTMLAttributes, RefObject } from 'react'
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

import { FlowingText } from '@ui/FlowingText/FlowingText'
import useFlowingText from '@ui/FlowingText/useFlowingText'
import { CloseIcon, FiberNewIcon, FirstPageIcon } from '@icons'
import { useBreakpoint } from '@shared/hooks/useBreakpoint'
import { useLayout } from '@shared/hooks/useContexts'
import { useNews } from '@shared/hooks/useNews'
import { cp } from '@styles/theme/helpers/colorPickers'

interface NewsBarProps extends HTMLAttributes<HTMLDivElement> {
  ref: RefObject<HTMLDivElement | null>
}

const NewsBar = (props: NewsBarProps) => {
  const { isNewsOpen, handleNewsOpen, handleNewsClose } = useLayout()
  const { news, loading } = useNews()
  const { bp, isDown } = useBreakpoint()

  const register = useFlowingText({
    textContent: news[0]?.description.plain,
    styleWithFixedWidth: {
      maxWidth: '90%',
      padding: '0 1rem 0 0.5rem',
    },
    pxPerSec: 180,
    spacerWidth: 64,
    trigger: isDown.md ? 'click' : 'hover',
    flowAfter: isDown.md ? undefined : 300,
  })

  const { handleReset, isDirty } = register

  // 初回ロード時にnewsステートがセットされたらニュースを開く
  useEffect(() => {
    if (loading || news.length === 0) return
    handleNewsOpen()
  }, [news, loading, handleNewsOpen])

  return (
    <NewsBarRoot className="news" $isNewsOpen={isNewsOpen} {...props}>
      {isDirty ? (
        <ResetButton className="flowing-text-reset-btn" type="button" aria-label="リセットボタン" onClick={handleReset}>
          <FirstPageIcon />
        </ResetButton>
      ) : (
        <FiberNewIcon
          sx={{
            ml: '0.5rem',
            height: '100%',
            width: (theme) => `calc(${theme.height.headerNews[bp]} - 0.5rem)`,
            padding: '0.3rem',
          }}
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

const NewsBarRoot = styled.div<{ $isNewsOpen: boolean }>`
  font-size: 1.6rem;
  background-color: ${({ theme }) => cp(theme, 'ui.headerNews.bg')};
  color: ${({ theme }) => cp(theme, 'ui.headerNews.contrastText')};
  height: ${({ theme }) => theme.height.headerNews.xs};
  line-height: ${({ theme }) => theme.height.headerNews.xs};
  display: flex;
  transform: translateY(${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '-100%')});
  /* 閉じた後にもスクロールバウンスによって見えてしまうので不可視化 */
  visibility: ${({ $isNewsOpen }) => ($isNewsOpen ? 'visible' : 'hidden')};
  transition:
    transform 300ms,
    visibility 0 linear ${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '300ms')};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    height: ${({ theme }) => theme.height.headerNews.sm};
    line-height: ${({ theme }) => theme.height.headerNews.sm};
  }
  ${({ theme }) => theme.breakpoints.up('md')} {
    height: ${({ theme }) => theme.height.headerNews.md};
    line-height: ${({ theme }) => theme.height.headerNews.md};
  }
  ${({ theme }) => theme.breakpoints.up('lg')} {
    height: ${({ theme }) => theme.height.headerNews.lg};
    line-height: ${({ theme }) => theme.height.headerNews.lg};
  }
  ${({ theme }) => theme.breakpoints.up('xl')} {
    height: ${({ theme }) => theme.height.headerNews.xl};
    line-height: ${({ theme }) => theme.height.headerNews.xl};
  }
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
  color: inherit;

  svg {
    display: block;
    padding: 0.3rem;
    width: inherit;
    height: inherit;
  }
`

export default NewsBar
