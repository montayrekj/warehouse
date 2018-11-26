<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card type="chart" style="max-height: calc(100vh - 88px); overflow: auto">
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
                  <tr>
                    <td> <input type="text" placeholder="Search" v-model="searchId" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchCustomerName" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchTotalAmount" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchPaidAmount" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchBalance" class="form-control"/> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchOrderedDate" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchOrderedFrom" class="form-control" /> </td>
                  </tr>
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
import axios from 'axios';
import moment from 'moment';
import config from '@/config'

export default {
  data() {
    return {
      table: {
        data: this.orders
      },
      tbodyClasses: '',
      searchId: '',
      searchCustomerName: '',
      searchTotalAmount: '',
      searchPaidAmount: '',
      searchBalance: '',
      searchOrderedDate: '',
      searchOrderedFrom: '',
      orders: []
    };
  },
  watch: {
    orders() {
      this.table.data = this.orders;
    },
    searchId: function () {
      if(this.searchId != '') {
        this.table.data = this.orders.filter(item => 
          item.orderId.toString().includes(this.searchId));
      }
      else
        this.table.data = this.orders;

      this.updateFilteredTable("searchId");
    },
    searchCustomerName: function () {
      if(this.searchCustomerName != '') {
        this.table.data = this.orders.filter(item => 
          item.customer.toUpperCase().includes(this.searchCustomerName.toUpperCase()));
      }
      else
        this.table.data = this.orders;

      this.updateFilteredTable("searchCustomerName");
    },
    searchTotalAmount: function () {
      if(this.searchTotalAmount != '') {
        this.table.data = this.orders.filter(item => 
          item.totalAmount.toString().includes(this.searchTotalAmount));
      }
      else
        this.table.data = this.orders;

      this.updateFilteredTable("searchTotalAmount");
    },
    searchPaidAmount: function () {
      if(this.searchPaidAmount != '') {
        this.table.data = this.sales.filter(item => 
          item.paidAmount.toString().includes(this.searchPaidAmount));
      }
      else
        this.table.data = this.orders;

      this.updateFilteredTable("searchPaidAmount");
    },
    searchBalance: function () {
      if(this.searchBalance != '') {
        this.table.data = this.orders.filter(item => 
          this.computeBalance(item.totalAmount,item.paidAmount).toString().includes(this.searchBalance));
      }
      else
        this.table.data = this.orders;

      this.updateFilteredTable("searchBalance");
    },
    searchOrderedDate: function () {
      if(this.searchOrderedDate != '') {
        this.table.data = this.sales.filter(item => 
          item.createdDate.toUpperCase().includes(this.searchOrderedDate.toUpperCase()));
      }
      else
        this.table.data = this.orders;

      this.updateFilteredTable("searchOrderedDate");
    },
    searchOrderedFrom: function () {
      if(this.searchOrderedFrom != '') {
        this.table.data = this.orders.filter(item => 
          item.createdBy.toUpperCase().includes(this.searchOrderedFrom.toUpperCase()));
      }
      else
        this.table.data = this.orders;

      this.updateFilteredTable("searchOrderedFrom");
    }
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
    tableColumns() {
      return this.$t('ViewActiveOrders.tableColumns');
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
    },
    updateFilteredTable(column) {
      if(this.searchId != '' && column != "searchId"){
        this.table.data = this.table.data.filter(item =>
          item.orderId.toString().includes(this.searchId));
      }

      if(this.searchCustomerName != '' && column != "searchCustomerName"){
        this.table.data = this.table.data.filter(item =>
          item.customer.toUpperCase().includes(this.searchCustomerName.toUpperCase()));
      }

      if(this.searchTotalAmount != '' && column != "searchTotalAmount"){
        this.table.data = this.table.data.filter(item =>
          item.totalAmount.toString().includes(this.searchTotalAmount));
      }

      if(this.searchPaidAmount != ''&& column != "searchPaidAmount"){
        this.table.data = this.table.data.filter(item =>
          item.paidAmount.toString().includes(this.searchPaidAmount));
      }

      if(this.searchBalance != '' && column != "searchBalance"){
        this.table.data = this.table.data.filter(item =>
          this.computeBalance(item.totalAmount,item.paidAmount).toString().includes(this.searchBalance));
      }

      if(this.searchOrderedDate != '' && column != "searchOrderedDate"){
        this.table.data = this.table.data.filter(item =>
          item.createdDate.toUpperCase().includes(this.searchOrderedDate.toUpperCase()));
      }

      if(this.searchOrderedFrom != '' && column != "searchOrderedFrom"){
        this.table.data = this.table.data.filter(item =>
          item.createdBy.toUpperCase().includes(this.searchOrderedFrom.toUpperCase()));
      }
    }
  },
  mounted() {
    var formData = new FormData();
    formData.append("active", false);

    axios
    .post(config.backend_host + '/getActiveOrders', formData)
    .then(response => {
      if(response.data.statusCode === "OK"){
        console.log(response.data.data)
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
