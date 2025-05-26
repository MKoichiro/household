import { Theme } from '@mui/material'
import { ChartOptions } from 'chart.js'
import { Context } from 'chartjs-plugin-datalabels'
import { cp } from '../../../../styles/theme/helpers/colorPickers'

// Pieコンポーネントに渡すオプション
const createPieOptions = (theme: Theme): ChartOptions<'pie'> => ({
  devicePixelRatio: 2.5,
  maintainAspectRatio: false,
  responsive: false,
  plugins: {
    legend: {
      labels: { color: cp(theme, 'app.lighterBg.level1.contrastText') },
    },
    datalabels: {
      formatter: (_, context) => context.chart?.data.labels?.[context.dataIndex],
      font: {
        weight: 'bold',
      },
      color: 'white',

      // ラベルの表示条件
      display: (context: Context) => {
        const dataset = context.dataset
        const sum = (dataset.data as number[]).reduce((a, b) => a + b, 0)
        const value = dataset.data[context.dataIndex] as number
        return value / sum > 0.05 // 5% より大きい場合に表示
      },
    },
  },
})

export default createPieOptions
