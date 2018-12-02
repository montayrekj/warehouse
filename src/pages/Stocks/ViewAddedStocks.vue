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
              <label>Id</label>
              <input type="text" class="form-control" placeholder="Enter id..." v-model="searchId" >
            </div>
            <div class="form-group col-md-5">
              <label>Added Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <date-picker v-model="searchAddedDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                    <div class="input-group-append eye-password" @click="clearDate('addedDateFrom')"><i class="fa fa-calendar-times"></i></div>
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <date-picker v-model="searchAddedDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date To..." :format="'MM/dd/yyyy'"></date-picker>
                    <div class="input-group-append eye-password" @click="clearDate('addedDateTo')"><i class="fa fa-calendar-times"></i></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-md-4">
              <label>Added By</label>
              <vue-bootstrap-typeahead 
                v-model="username"
                :data="userList"
                :minMatchingChars="0"
                placeholder="Enter name..."
                @hit="selectUser"/>
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
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import axios from 'axios';
  import config from '@/config'
  import moment from 'moment';

  export default {
    components: {
      DatePicker,
      VueBootstrapTypeahead
    },
    data() {
      return {
        table: {
          data: this.purchases
        },
        hideFlag: false,
        searchId: '',
        searchAddedDateFrom: '',
        searchAddedDateTo: '',
        searchAddedBy: '',
        tbodyClasses: '',
        detailsData: [],
        userList: [],
        username: ''
      };
    },
    props: {
      purchases: Array,
    },
    watch: {
      purchases: function() {
        this.table.data = this.purchases;
      },
      username() {
        if(this.username != this.searchAddedBy) {
          this.searchAddedBy = '';
        }
      },
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('ViewAddedStocks.tableColumns');
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
      },
      clearDate(element) {
        switch(element){
          case 'addedDateFrom': this.searchAddedDateFrom = '';
            break;
          case 'addedDateTo': this.searchAddedDateTo = '';
            break;
        }
      },
      selectUser() {
        this.searchAddedBy = this.username;
      },
      search() {
        var baseurl = '/getPurchasesLogs?'
        var url = "";
        url += "id=" + this.searchId
        if(this.searchAddedDateFrom != '')
          url += "&addedDateFrom=" + (this.searchAddedDateFrom.getMonth() + 1) + '/' + this.searchAddedDateFrom.getDate() + '/' +  this.searchAddedDateFrom.getFullYear();
        else
          url += "&addedDateFrom=" + '';

        if(this.searchAddedDateTo != '')
          url += "&addedDateTo=" + (this.searchAddedDateTo.getMonth() + 1) + '/' + this.searchAddedDateTo.getDate() + '/' +  this.searchAddedDateTo.getFullYear();
        else
          url += "&addedDateTo=" + '';

        url += "&addedBy=" + this.username
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
