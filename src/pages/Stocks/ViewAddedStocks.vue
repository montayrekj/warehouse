<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card>
          <h4>Advanced Search</h4>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Id</label>
              <input type="text" class="form-control" placeholder="Enter id..." v-model="searchId" >
            </div>
            <div class="form-group col-md-4">
              <label>Added Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                    <date-picker :value="searchAddedDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
                <div class="form-group col-md-6">
                    <date-picker :value="searchAddedDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date To..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
              </div>
            </div>
            <div class="form-group col-md-4">
              <label>Added By</label>
              <input type="text" class="form-control"  placeholder="Enter name..." v-model="searchAddedBy" >
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-10"></div>
            <div class="col-md-2">
              <button class="btn btn-success" style="width: 100%">Search</button>
            </div>
          </div>
        </card>
        <card type="chart">
          <div>
            <div class="col-12">
              <div class="table-responsive">
                <table class="table tablesorter" :class="tableClass">
                  <thead class="text-primary">
                  <tr>
                    <slot name="columns" style="text-align: center">
                      <th v-for="(column, index) in tableColumns" :key="index" style="text-align: center;">{{column.Header}}</th>
                    </slot>
                  </tr>
                  </thead>
                  <tbody :class="tbodyClasses">
                  <tr v-for="(item, index) in table.data" :key="index">
                    <slot :row="item">
                      <td v-for="(column, index) in tableColumns"
                          :key="index"
                          v-if="hasValue(item, column)" style="text-align: center;">
                        <a v-bind:href="'/#/stocks/viewAddedStocks/' + item.purchasesLogsId" v-if="column.Header === 'Id'">{{itemValue(item, column)}}</a>
                        <label v-if="column.Header !== 'Id'">{{itemValue(item, column)}}</label>
                      </td>
                    </slot>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>

  import DatePicker from 'vuejs-datepicker';

  export default {
    components: {
      DatePicker
    },
    data() {
      return {
        table: {
          data: this.purchases
        },
        searchId: '',
        searchAddedDateFrom: '',
        searchAddedDateTo: '',
        searchAddedBy: '',
        tbodyClasses: '',
        detailsData: []
      };
    },
    props: {
      purchases: Array,
    },
    watch: {
      purchases: function() {
        this.table.data = this.purchases;
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('ViewAddedStocks.tableColumns');
      }
    },
    methods: {
      hasValue(item, column) {
        if(column.Item == 'Balance')
          return true;
        else
          return item[column.Item] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.Item];
      },
      computeBalance(totalAmount, paidAmount)  {
        var balance = 0;
        totalAmount = Number(totalAmount);
        paidAmount = Number(paidAmount);
        if(paidAmount >= totalAmount)
          balance = 0;
        else
          balance = totalAmount - paidAmount;

        return balance;
      }
    }
  };
</script>
<style>
</style>
