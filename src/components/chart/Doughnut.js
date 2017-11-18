import 'chart.js'
import {Doughnut} from 'vue-chartjs'

export default({
  extends:Doughnut,
  props: ['chartLabels', 'chartData', 'chartColors'],
  mounted () {
    this.renderChart({
      labels: this.chartLabels,
      datasets: [
        {
          backgroundColor: this.chartColors,
          data: this.chartData
        }
      ]
    }, {responsive: false, maintainAspectRatio: false})
  }
})
