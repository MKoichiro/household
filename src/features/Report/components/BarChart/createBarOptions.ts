import { alpha, Theme } from '@mui/material'
import { ChartOptions } from 'chart.js'
import { cpf } from '../../../../styles/theme/helpers/colorPickers'

// 「千」、「万」、「億」...を使ってフォーマット
const yTicksFormatter = (value: string | number): string => {
  const num = Number(value)
  if (isNaN(num)) throw new Error('Invalid number')

  // 「千」は自力で。
  const numAbs = Math.abs(num)
  if (numAbs >= 1000 && numAbs < 10000) {
    const numStr = num.toString()
    if (num > 0) {
      return numStr[0] + '千'
    } else {
      return '-' + numStr[1] + '千'
    }
  }

  // 「万」以降は Intl.NumberFormat が便利。
  const display = new Intl.NumberFormat('ja-JP', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num)
  return display
}

const fontColorPicker = cpf('app.lighterBg.level1.contrastText')
const gridColorPicker = (theme: Theme) => alpha(theme.palette.text.disabled, 0.1)

const createBarOptions = (theme: Theme, remToPx: (rem: number) => number): ChartOptions<'bar'> => ({
  devicePixelRatio: 2.5,
  maintainAspectRatio: false,
  responsive: true,
  transitions: {
    zoom: { animation: { duration: 500, easing: 'easeInOutCubic' } },
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
      pan: { enabled: true, mode: 'x' },
      zoom: { mode: 'x', wheel: { enabled: true, speed: 1 }, pinch: { enabled: true } },
      limits: { x: { min: 1, max: 31, minRange: 2 } },
    },
  },
  scales: {
    x: {
      ticks: { color: fontColorPicker(theme), font: { size: remToPx(1.2) } },
      grid: { color: gridColorPicker(theme) },
    },
    y: {
      ticks: {
        color: fontColorPicker(theme),
        font: { size: remToPx(1.2) },
        callback: yTicksFormatter,
        // 間引く
        autoSkip: true,
        maxTicksLimit: 10,
      },
      grid: { color: gridColorPicker(theme) },
    },
  },
})

export default createBarOptions
