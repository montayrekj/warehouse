<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card>
          <h4>Advanced Search</h4>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Order Id</label>
              <input type="text" class="form-control" placeholder="Enter order id..." v-model="searchOrderId" >
            </div>
            <div class="form-group col-md-4">
              <label>Customer Name</label>
              <input type="text" class="form-control"  placeholder="Enter customer name..." v-model="searchCustomerName" >
            </div>
            <div class="form-group col-md-4">
              <label>Total Amount</label>
              <input type="text" class="form-control"  placeholder="Enter total amount..." v-model="searchTotalAmount" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Payment Status</label>
              <select class="form-control" v-model="searchPaymentStatus">
                <option value="selectPaymentStatus" disabled selected>Select payment status...</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Full">Full</option>
              </select>
            </div>
            <div class="form-group col-md-4">
              <label>Ordered Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                    <date-picker :value="searchOrderedDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
                <div class="form-group col-md-6">
                    <date-picker :value="searchOrderedDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date To..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
              </div>
            </div>
            <div class="form-group col-md-4">
              <label>Ordered From</label>
              <input type="text" class="form-control"  placeholder="Enter name..." v-model="searchOrderedFrom" >
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
                        <a v-bind:href="'/#/orders/viewOrders/' + item.orderId" v-if="column.Header === 'Order Id'">{{itemValue(item, column)}}</a>
                        <label v-if="column.Header !== 'Order Id'">{{itemValue(item, column)}}</label>
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
  import axios from 'axios';
  import moment from 'moment';
  import config from '@/config'

  export default {
    components: {
      DatePicker
    },
    data() {
      return {
        table: {
          data: this.orders
        },
        tbodyClasses: '',
        searchOrderId: '',
        searchCustomerName: '',
        searchTotalAmount: '',
        searchPaymentStatus: 'selectPaymentStatus',
        searchOrderedDateFrom: '',
        searchOrderedDateTo: '',
        searchOrderedFrom: '',
        orders: []
      };
    },
    watch: {
      orders: function() {
        this.table.data = this.orders;
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('ViewCompletedOrders.tableColumns');
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
        var temp = item[column.Item];
        if(column.Item == "Balance")
          return this.computeBalance(item["totalAmount"], item["paidAmount"]);

        return temp;
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
    },
    mounted() {
      var formData = new FormData();
      formData.append("active", true);

      axios
      .post(config.backend_host + '/getActiveOrders', formData)
      .then(response => {
        if(response.data.statusCode === "OK"){
          for(var i = 0; i < response.data.data.length; i++) {
            response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
          }
          this.orders = response.data.data;
        }
      })
    }
  };
</script>
<style>
</style>
