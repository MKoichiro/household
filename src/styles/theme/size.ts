import type { Height, Width } from '@mui/material'

export const width: Width = {
  navigationMenu: { xs: '50vw', sm: '50vw', md: '30vw', lg: '240px', xl: '240px' },
  // 0... half modal での表示に切り替わるので、使用しない。
  transactionMenu: { xs: 0, sm: 0, md: 0, lg: '320px', xl: '320px' },
}

export const height: Height = {
  header: { xs: '64px', sm: '64px', md: '64px', lg: '64px', xl: '64px' },
  headerNews: { xs: '32px', sm: '32px', md: '32px', lg: '32px', xl: '32px' },
  footer: { xs: '160px', sm: '160px', md: '160px', lg: '160px', xl: '160px' },
}
