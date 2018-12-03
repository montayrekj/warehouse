<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card :style="hide">
          <h4>Advanced Search 
            <i class="advanced-search-icon" :class="searchIcon" @click="hideFlag = !hideFlag"></i>
          </h4>
          <div class="row">
            <div class="form-group col-md-3">
              <label>Order Id</label>
              <input type="text" class="form-control" placeholder="Enter order id..." v-model="searchOrderId" >
            </div>
            <div class="form-group col-md-5">
              <label>Customer Name</label>
              <vue-bootstrap-typeahead 
                v-model="customerName"
                :data="customerList"
                :minMatchingChars="0"
                placeholder="Enter customer name..."
                @hit="selectCustomer"/>
            </div>
            <div class="form-group col-md-4">
              <label>Ordered From</label>
              <vue-bootstrap-typeahead 
                v-model="username"
                :data="userList"
                :minMatchingChars="0"
                placeholder="Enter name..."
                @hit="selectUser"/>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-3">
              <label>Payment Status</label>
              <div class="input-group">
                <select class="form-control input-group-select" v-model="searchPaymentStatus">
                  <option value="selectPaymentStatus" disabled selected>Select payment status...</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Full">Full</option>
                </select>
                <div class="input-group-append eye-password" @click="clearPaymentStatus"><i class="fa fa-times"></i></div>
              </div>
            </div>
            <div class="form-group col-md-5">
              <label>Ordered Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <date-picker v-model="searchOrderedDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                    <div class="input-group-append eye-password" @click="clearDate('orderedDateFrom')"><i class="fa fa-calendar-times"></i></div>
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <date-picker v-model="searchOrderedDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date To..." :format="'MM/dd/yyyy'"></date-picker>
                    <div class="input-group-append eye-password" @click="clearDate('orderedDateTo')"><i class="fa fa-calendar-times"></i></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-md-2">
              <label for="contactNo" class="add-customer-label pull-left">Customer Level.</label>
              <div class="input-group">
                <select class="form-control" v-model="customerLevel">
                  <option value="defaultLevel" disabled selected>Select customer level...</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <div class="input-group-append eye-password" @click="clearLevel"><i class="fa fa-times"></i></div>
              </div>
            </div>
            <div class="form-group col-md-2">
              <label>Total Amount</label>
              <input type="text" class="form-control"  placeholder="Enter total amount..." v-model="searchTotalAmount" >
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-10"></div>
            <div class="col-md-2">
              <button class="btn btn-success" style="width: 100%" @click="search">Search</button>
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
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import axios from 'axios';
  import moment from 'moment';
  import config from '@/config'

  export default {
    components: {
      DatePicker,
      VueBootstrapTypeahead
    },
    data() {
      return {
        table: {
          data: this.orders
        },
        hideFlag: false,
        tbodyClasses: '',
        searchOrderId: '',
        customerName: "",
        customerLevel: "defaultLevel",
        customerList: this.customers.map(arr => arr.customerName),
        username: "",
        userList: [],
        searchCustomerName: '',
        searchTotalAmount: '',
        searchPaymentStatus: 'selectPaymentStatus',
        searchOrderedDateFrom: '',
        searchOrderedDateTo: '',
        searchOrderedFrom: '',
        orders: []
      };
    },
    props: {
      customers: Array
    },
    watch: {
      orders: function() {
        this.table.data = this.orders;
      },
      customers() {
        this.customerList = this.customers.map(arr => arr.customerName);
      },
      username() {
        if(this.username != this.searchOrderedFrom) {
          this.searchOrderedFrom = '';
        }
      },
      customerName() {
        if(this.customerName != this.searchCustomerName) {
          this.searchCustomerName = '';
        }
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('ViewClosedOrders.tableColumns');
      },
      hide() {
        if(this.hideFlag) {
          return "max-height: 55px; overflow: hidden; -webkit-transition: 0.01s; transition: max-height 0.01s ease-in;"
        } else {
          return "max-height: 1000px; -webkit-transition: 0.7s; transition: max-height 0.7s ease-out; "
        }
      },
      searchIcon() {
        if(this.hideFlag) {
          return "tim-icons icon-minimal-right"
        } else {
          return "tim-icons icon-minimal-down"
        }
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
        if(column.Item == "Balance") {
          return this.computeBalance(item["totalAmount"], item["paidAmount"]);
        }
        else if(column.Item == "totalAmount") {
          return "PHP " + temp.toLocaleString();
        } else if(column.Item == "paidAmount") {
          return "PHP " + temp.toLocaleString();
        } else if(column.Item == "balance") {
          return "PHP " + temp.toLocaleString();
        }
        else if(column.Item == "purchaseOrderStatus") {
          if(temp == 3) {
            return "Completed"
          } else {
            return "Declined"
          }
        }

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
      clearPaymentStatus() {
        this.searchPaymentStatus = 'selectPaymentStatus';
      },
      clearLevel() {
        this.customerLevel = 'defaultLevel';
      },
      clearDate(element) {
        switch(element){
          case 'orderedDateFrom': this.searchOrderedDateFrom = '';
            break;
          case 'orderedDateTo': this.searchOrderedDateTo = '';
            break;
        }
      },
      selectCustomer() {
        this.searchCustomerName = this.customerName;
      },
      selectUser() {
        this.searchOrderedFrom = this.username;
      },
      search() {
        var formData = new FormData();
        formData.append("active", false);

        var baseurl = '/getActiveOrders?'
        var url = "";
        url += "orderId=" + this.searchOrderId
        url += "&customerName=" + this.customerName
        url += "&totalAmount=" + this.searchTotalAmount
        if(this.searchPaymentStatus == 'selectPaymentStatus'){
          url += "&paymentStatus=" + ''
        } else {
          url += "&paymentStatus=" + this.searchPaymentStatus
        }

        if(this.customerLevel == 'defaultLevel'){
          url += "&customerLevel=" + ''
        } else {
          url += "&customerLevel=" + this.customerLevel
        }

        if(this.searchOrderedDateFrom != '')
          url += "&orderedDateFrom=" + (this.searchOrderedDateFrom.getMonth() + 1) + '/' + this.searchOrderedDateFrom.getDate() + '/' +  this.searchOrderedDateFrom.getFullYear();
        else
          url += "&orderedDateFrom=" + '';

        if(this.searchOrderedDateTo != '')
          url += "&orderedDateTo=" + (this.searchOrderedDateTo.getMonth() + 1) + '/' + this.searchOrderedDateTo.getDate() + '/' +  this.searchOrderedDateTo.getFullYear();
        else
          url += "&orderedDateTo=" + '';

        url += "&orderedFrom=" + this.username

        url += "&active=" + true;
        
        axios
          .get(config.backend_host + (baseurl + url))
          .then(response => {
            if(response.data.statusCode === "OK"){
              for(var i = 0; i < response.data.data.length; i++) {
                response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
              }
              this.table.data = response.data.data;
            }
          })
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

      axios
        .post(config.backend_host + "/getUsers")
        .then(response => {
          if(response.data.statusCode === "OK"){
            this.userList = response.data.data.map(arr => arr.username);
          }
        })
    }
  };
</script>
<style>
</style>
