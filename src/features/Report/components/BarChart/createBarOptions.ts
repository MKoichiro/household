import { Theme } from '@mui/material'
import { ChartOptions } from 'chart.js'

// 「万」、「億」...を使ってフォーマット
const yTicksFormatter = (value: string | number): string => {
  const num = Number(value)
  if (isNaN(num)) throw new Error('Invalid number')
  const display = new Intl.NumberFormat('ja-JP', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
  return display
}

const fontColorPicker = (theme: Theme) => theme.palette.app.lighterBg.level1.contrastText[theme.palette.mode]
const gridColorPicker = (theme: Theme) => theme.palette.app.lighterBg.level2.contrastText[theme.palette.mode]

const createBarOptions = (theme: Theme, remToPx: (rem: number) => number): ChartOptions<'bar'> => ({
  devicePixelRatio: 2.5,
  maintainAspectRatio: false,
  responsive: true,
  transitions: {
    zoom: {
      animation: {
        duration: 500,
        easing: 'easeInOutCubic',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top',
      labels: { color: fontColorPicker(theme) },
    },
    title: {
      display: true,
      text: '日別収支 （ 円 / 日 ）',
      color: fontColorPicker(theme),
      font: { size: remToPx(1.6) },
    },
    datalabels: { display: false },
    // see: https://www.chartjs.org/chartjs-plugin-zoom/latest/guide/options.html#options
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
      },
      zoom: {
        mode: 'x',
        wheel: {
          enabled: true,
          speed: 1,
        },
        pinch: {
          enabled: true,
        },
      },
      limits: {
        x: { min: 1, max: 31, minRange: 2 },
      },
    },
  },
  scales: {
    x: {
      // title: {
      //   display: true,
      //   text: '日付 [日]',
      //   color: fontColorPicker(theme),
      //   font: { size: remToPx(1.4) },
      // },
      ticks: {
        color: theme.palette.text.primary,
        font: { size: remToPx(1.2) },
      },
      grid: { color: gridColorPicker(theme) },
    },
    y: {
      ticks: {
        color: theme.palette.text.primary,
        font: { size: remToPx(1.2) },
        callback: yTicksFormatter,
      },
      grid: { color: gridColorPicker(theme) },
      // title: {
      //   display: true,
      //   text: '金額 [円]',
      //   color: fontColorPicker(theme),
      //   font: { size: remToPx(1.4) },
      // },
    },
  },
})

export default createBarOptions
