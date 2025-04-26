import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import { Button, IconButton, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import HeaderTitle from '../common/HeaderTitle'
import { useAuth, useLayout } from '../../shared/hooks/useContexts'
import { useNews } from '../../shared/hooks/useNews'
import { useEffect } from 'react'
import { headerMainHeight, headerNewsHeight, navigationMenuWidth } from '../../shared/constants/ui'
import { purple } from '@mui/material/colors'
import FlowingText from './FlowingText'

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

interface AuthedHeaderProps {
  onMenuToggleClick: () => void
  isNavigationMenuOpen: boolean
}

const AuthedHeader = ({ onMenuToggleClick: handleMenuToggleClick, isNavigationMenuOpen }: AuthedHeaderProps) => {
  const { isLogoutProcessing, handleLogout } = useAuth()
  const { isNewsOpen } = useLayout()

  // エラーハンドリングはhandleLogout内で行う
  const logout = () => void handleLogout()

  return (
    <Header $isNavigationMenuOpen={isNavigationMenuOpen} $isNewsOpen={isNewsOpen}>
      <NewsBar />
      <HeaderMain $isNewsOpen={isNewsOpen}>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          edge="start"
          onClick={handleMenuToggleClick}
          sx={{
            mr: 2,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MenuIcon />
        </IconButton>

        <HeaderTitle redirectTo="home" />

        <Button
          variant="outlined"
          aria-label="ログアウトボタン"
          sx={{
            display: 'flex',
            ml: 'auto',
            color: 'white',
            borderColor: 'white',
          }}
          endIcon={<LogoutIcon />}
          onClick={logout}
          disabled={isLogoutProcessing}
        >
          {/* TODO: スマートフォン版では、フォント縮小、またはアイコンのみ、またはアコーディオンなど新規UI */}
          ログアウト
        </Button>
      </HeaderMain>
    </Header>
  )
}

export default AuthedHeader

const Header = styled.header<{ $isNavigationMenuOpen: boolean; $isNewsOpen: boolean }>`
  background-color: ${({ theme }) => theme.palette.header.main};

  position: sticky;
  top: ${({ $isNewsOpen }) => ($isNewsOpen ? `-${headerNewsHeight}px` : '0')};
  left: ${({ $isNavigationMenuOpen }) => ($isNavigationMenuOpen ? `${navigationMenuWidth}px` : '0')};
  z-index: ${({ theme }) => theme.zIndex.header.lg};
  width: ${({ $isNavigationMenuOpen }) => `calc(100% - ${$isNavigationMenuOpen ? navigationMenuWidth : 0}px)`};
  height: ${({ $isNewsOpen }) => `${$isNewsOpen ? headerMainHeight + headerNewsHeight : headerMainHeight}px`};
  transition:
    left 300ms ease,
    width 300ms ease,
    height 300ms ease;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    left: 0;
    width: 100%;
    z-index: ${({ theme }) => theme.zIndex.header.md};
  }
`
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

const HeaderMain = styled.div<{ $isNewsOpen: boolean }>`
  color: white;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  height: ${headerMainHeight}px;
  transform: translateY(${({ $isNewsOpen }) => ($isNewsOpen ? '0' : '-32px')});
  transition: transform 300ms ease;
`
