/** グローバル変数や、CSSBaseline でカバーしきれないリセットを記述 */
import { GlobalStyles as MUIGlobalStyles } from '@mui/material'

import { htmlFontSizes } from './constants'

const GlobalStyles = () => {
  return (
    <MUIGlobalStyles
      styles={(theme) => ({
        ':root': {
          // NOTE: FullCalendar のデフォルトの CSS 変数（すべて）
          // 必要に応じて、アンコメンアウトして上書き
          // '--fc-small-font-size': .85em;
          '--fc-page-bg-color': 'transparent',
          // '--fc-neutral-bg-color': hsla(0,0%,82%,.3);
          // '--fc-neutral-text-color': grey;
          // '--fc-border-color': #ddd;
          // '--fc-button-text-color': #fff;
          // '--fc-button-bg-color': #2c3e50;
          // '--fc-button-border-color': #2c3e50;
          // '--fc-button-hover-bg-color': #1e2b37;
          // '--fc-button-hover-border-color': #1a252f;
          // '--fc-button-active-bg-color': #1a252f;
          // '--fc-button-active-border-color': #151e27;
          // '--fc-event-bg-color': #3788d8;
          // '--fc-event-border-color': #3788d8;
          // '--fc-event-text-color': #fff;
          // '--fc-event-selected-overlay-color': rgba(0,0,0,.25);
          // '--fc-more-link-bg-color': #d0d0d0;
          // '--fc-more-link-text-color': inherit;
          // '--fc-event-resizer-thickness': 8px;
          // '--fc-event-resizer-dot-total-width': 8px;
          // '--fc-event-resizer-dot-border-width': 1px;
          // '--fc-non-business-color': hsla(0,0%,84%,.3);
          // '--fc-bg-event-color': #8fdf82;
          // '--fc-bg-event-opacity': 0.3;
          // '--fc-highlight-color': rgba(188,232,241,.3);
          // '--fc-today-bg-color': rgba(255,220,40,.15);
          // '--fc-now-indicator-color': red;
        },
        html: {
          fontSize: `${htmlFontSizes.xs}%`,
          [theme.breakpoints.up('sm')]: { fontSize: `${htmlFontSizes.sm}%` },
          [theme.breakpoints.up('md')]: { fontSize: `${htmlFontSizes.md}%` },
          [theme.breakpoints.up('lg')]: { fontSize: `${htmlFontSizes.lg}%` },
          [theme.breakpoints.up('xl')]: { fontSize: `${htmlFontSizes.xl}%` },
        },
        nav: {
          padding: 0,
        },
        ul: {
          padding: 0,
          margin: 0,
          listStyle: 'none',
        },
        dl: {
          padding: 0,
          margin: 0,
        },
      })}
    />
  )
}

export default GlobalStyles
