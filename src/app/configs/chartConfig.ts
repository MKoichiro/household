import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ArcElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import zoomPlugin from 'chartjs-plugin-zoom'

ChartJS.register(
  // common
  Title,
  Tooltip,
  Legend,

  // for Bar Chart
  CategoryScale,
  LinearScale,
  BarElement,
  zoomPlugin, // 軸の拡大縮小のためのプラグイン

  // for Pie Chart
  ArcElement,
  ChartDataLabels //グラフ内ラベル書き込みのための拡張機能
)
