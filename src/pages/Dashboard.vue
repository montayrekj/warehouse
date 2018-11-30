<template>
  <div style="max-height: calc(100vh - 88px); overflow-y: auto; overflow-x: hidden">
    <div class="row">
      <div class="col-lg-4">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Daily Sales</h5>
            <h3 class="card-title"><i class="tim-icons icon-money-coins text-primary "></i> {{dailySales}} </h3>
          </template>
        </card>
      </div>
      <div class="col-lg-4">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Weekly Sales</h5>
            <h3 class="card-title"><i class="tim-icons icon-money-coins text-info "></i> {{weeklySales}} </h3>
          </template>
        </card>
      </div>
      <div class="col-lg-4">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">Monthly Sales</h5>
            <h3 class="card-title"><i class="tim-icons icon-money-coins text-success "></i> {{monthlySales}} </h3>
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
  import axios from 'axios';
  const entityColumns = [
      "productName", 
      "productCode", 
      "quantity", 
      "unit",  
      "supplier"
    ]
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
          categories: [],
        },
        table: {
          data: [],
          activeIndex: 0
        },
        tbodyClasses: '',
        dailySales: 0,
        weeklySales: 0,
        monthlySales: 0,
        dailySalesChart: [],
        monthlySalesChart: []
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
          }],
          labels: []
        }

        switch(index) {
          case 0:
            chartData.labels = ['SUN','MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            chartData.datasets[0].data = this.dailySalesChart
            break;
          case 1:
            chartData.labels = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            chartData.datasets[0].data = this.monthlySalesChart
            break;
        }
        
        this.salesLineChart.chartData = chartData;
        this.$refs.salesChart.updateGradients(this.salesLineChart.chartData);
        this.salesLineChart.activeIndex = index;
      },
      hasValue(item, column) {
        var tc = this.dashboardTableColumns;
        var ec = [...entityColumns];
        var index = tc.indexOf(column)
      
        return item[ec[index]] !== "undefined";
      },
      itemValue(item, column) {
        var tc = this.dashboardTableColumns;
        var ec = [...entityColumns];
        var index = tc.indexOf(column)

        if(column === "Price")
          return Number(item[ec[index]]).toFixed(2);
        else
          return item[ec[index]];
    },
    },
    mounted() {
      
      axios
        .post(config.backend_host + '/getProductsBelowLimit')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.table.data = response.data.data;
        })

      axios
        .post(config.backend_host + '/dailySales')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.dailySales = response.data.data;
        })

      axios
        .post(config.backend_host + '/weeklySales')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.weeklySales = response.data.data;
        })

      axios
        .post(config.backend_host + '/monthlySales')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.monthlySales = response.data.data;
        })

      axios
        .post(config.backend_host + '/dailySalesChart')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.dailySalesChart = response.data.data;
            this.initChart(0);
        })

      axios
        .post(config.backend_host + '/monthlySalesChart')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.monthlySalesChart = response.data.data;
        })

      
    }
  };
</script>
<style scoped>
  .out-of-stock {
    background-image: linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93);
    color: #fff;
  }
</style>
