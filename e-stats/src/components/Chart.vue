<script>
import { Line, Bar, mixins } from "vue-chartjs";
export default {
  name: "Chart",
  // mixins: [mixins.reactiveProp],
  extends: Line,
  props: { chartData: Object },
  data() {
    return {
      // options: {
      //   title: {
      //     display: true
      //   },
      //   responsive: true, 
      //   maintainAspectRatio: true,
      // }
    };
  },
  mounted: function() {
    this.renderChart(this.chartData.data);
    // console.log(this.chartData.data)
  },
  watch: {
    chartData: function() {
      this.renderChart(this.chartData.data);
    }
  }
};
</script>