<template>
  <div style="max-height: calc(100vh - 88px); overflow-y: auto; overflow-x: hidden">
    <div class="row">
      <div class="col-lg-4">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Daily Sales</h5>
            <h3 class="card-title"><i class="tim-icons icon-money-coins text-primary "></i> 3,215</h3>
          </template>
        </card>
      </div>
      <div class="col-lg-4">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Weekly Sales</h5>
            <h3 class="card-title"><i class="tim-icons icon-money-coins text-info "></i> 15,426</h3>
          </template>
        </card>
      </div>
      <div class="col-lg-4">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Monthly Sales</h5>
            <h3 class="card-title"><i class="tim-icons icon-money-coins text-success "></i> 72,392</h3>
          </template>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <card type="chart" >
          <template slot="header">
            <div class="row">
              <div class="col-sm-6" :class="'text-left'">
                <h5 class="card-category">Total Sales</h5>
                <h2 class="card-title">Performance</h2>
              </div>
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle"
                     :class="'float-right'"
                     data-toggle="buttons">
                  <label v-for="(option, index) in chartCategories"
                         :key="option"
                         class="btn btn-sm btn-primary btn-simple"
                         :class="{active: salesLineChart.activeIndex === index}"
                         :id="index">
                    <input type="radio"
                           @click="initChart(index)"
                           name="options" autocomplete="off"
                           :checked="salesLineChart.activeIndex === index">
                    {{option}}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        ref="salesChart"
                        :chart-data="salesLineChart.chartData"
                        :gradient-colors="salesLineChart.gradientColors"
                        :gradient-stops="salesLineChart.gradientStops"
                        :extra-options="salesLineChart.extraOptions">
            </line-chart>
          </div>
          <div class="row">
            <div class="col-4"></div>
            <div class="col-3">
              <h5 class="card-category"><i class="tim-icons icon-simple-delete text-success "></i> In</h5>     
            </div>
            <div class="col-3">
              <h5 class="card-category"><i class="tim-icons icon-simple-delete text-info "></i> Out</h5>
            </div>
            <div class="col-2"></div>
          </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <card class="card">
          <h4 slot="header" class="card-title">Low Stocks</h4>
          <div class="table-responsive">
            <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
              <tr>
                <slot name="columns" style="text-align: center">
                  <th v-for="column in dashboardTableColumns" :key="column">
                    {{column}}
                  </th>
                </slot>
              </tr>
              </thead>
              <tbody :class="tbodyClasses">
                <tr v-for="(item, index) in table.data" :key="index" :class="{ 'out-of-stock': itemValue(item, 'Quantity') == 0}">
                  <slot :row="item">
                    <td v-for="(column, index) in dashboardTableColumns"
                        :key="index"
                        v-if="hasValue(item, column)">  
                          {{itemValue(item, column)}}
                    </td>
                  </slot>
                </tr>
              </tbody>
            </table>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
  import LineChart from '@/components/Charts/LineChart';
  import * as chartConfigs from '@/components/Charts/config';
  import config from '@/config';

  const tableData = [
    {
      id: 1,
      name: "Ganador",
      code: "GNDR",
      quantity: "0",
      unit: "Sack",
      supplier: "Rabago's Merchandise"

    },
    {
      id: 2,
      name: "Lion Ivory",
      code: "LNIVRY",
      quantity: "2",
      unit: "Sack",
      supplier: "Bugasan ni Juan"
    },
    {
      id: 3,
      name: "NFA Rice",
      code: "NFA",
      quantity: "0",
      unit: "Kilo",
      supplier: "Bayanihan Market"
    }
  ];

  export default {
    components: {
      LineChart
    },
    data() {
      return {
        salesLineChart: {
          activeIndex: 0,
          chartData: null,
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.4, 0],
          categories: []
        },
        table: {
          data: [...tableData],
          activeIndex: 0
        },
        tbodyClasses: ''
      }
    },
    computed: {
      chartCategories() {
        return this.$t('dashboard.chartCategories');
      },
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      dashboardTableColumns() {
        return this.$t('dashboard.tableColumns');
      }
    },
    methods: {
      initChart(index) {
        let chartData = {
          datasets: 
          [{
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: []
          },
          {
            fill: true,
            borderColor: config.colors.info,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.info,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.info,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: []
          }],
          labels: []
        }

        switch(index) {
          case 0:
            chartData.labels = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            chartData.datasets[0].data = [100, 70, 90, 70, 85, 60, 75];
            chartData.datasets[1].data = [90, 60, 80, 60, 75, 50, 65];
            break;
          case 1:
            chartData.labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            chartData.datasets[0].data = [80, 120, 105, 110, 95, 105, 90, 100, 80, 95, 70, 120];
            chartData.datasets[1].data = [70, 130, 95, 120, 85, 115, 80, 110, 70, 105, 60, 130];
            break;
        }
        
        this.salesLineChart.chartData = chartData;
        this.$refs.salesChart.updateGradients(this.salesLineChart.chartData);
        this.salesLineChart.activeIndex = index;
      },
      hasValue(item, column) {
        return item[column.toLowerCase()] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.toLowerCase()];
      }
    },
    mounted() {
      this.initChart(0);
    }
  };
</script>
<style scoped>
  .out-of-stock {
    background-image: linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93);
    color: #fff;
  }
</style>
