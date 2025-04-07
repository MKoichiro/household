import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,

  CategoryScale,
  LinearScale,
  BarElement,

  ArcElement,
} from 'chart.js'

import ChartDataLabels from 'chartjs-plugin-datalabels'


ChartJS.register(
  // common
  Title,
  Tooltip,
  Legend,

  // for Bar Chart
  CategoryScale,
  LinearScale,
  BarElement,

  // for Pie Chart
  ArcElement,
  ChartDataLabels, //グラフ内ラベル書き込みのための拡張機能
)

ChartJS.register(
)