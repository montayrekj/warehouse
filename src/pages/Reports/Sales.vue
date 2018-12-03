<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card :style="hide">
          <h4>Advanced Search 
            <i class="advanced-search-icon" :class="searchIcon" @click="hideFlag = !hideFlag"></i>
          </h4>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Customer Name</label>
              <vue-bootstrap-typeahead 
                v-model="customerName"
                :data="customerList"
                :minMatchingChars="0"
                placeholder="Enter customer name..."
                @hit="selectCustomer"/>
            </div>
            <div class="form-group col-md-4">
              <label>Type</label>
              <div class="input-group">
                <select class="form-control input-group-select" v-model="searchType">
                  <option value="selectAType" disabled selected>Select a type...</option>
                  <option value="Cash">Cash</option>
                  <option value="Term">Term</option> 
                </select>
                <div class="input-group-append eye-password" @click="clearSearchType"><i class="fa fa-times"></i></div>
              </div>
            </div>
            <div class="form-group col-md-4">
              <label>Paid Amount</label>
              <input type="text" class="form-control"  placeholder="Enter paid amount..." v-model="searchPaidAmount" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Paid Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <date-picker v-model="searchPaidDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                    <div class="input-group-append eye-password" @click="clearDate('paidDateFrom')"><i class="fa fa-calendar-times"></i></div>
                  </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <date-picker v-model="searchPaidDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date to..." :format="'MM/dd/yyyy'"></date-picker>
                    <div class="input-group-append eye-password" @click="clearDate('paidDateTo')"><i class="fa fa-calendar-times"></i></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-md-4">
              <label>Paid To</label>
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
              <div style="padding-bottom: 10px; width: 100%">
                <div class="row">
                  <div class="col-md-10"></div>
                  <div class="col-md-2">
                    <div :class="'float-right'" style="width: 100%;">
                      <label class="btn btn-primary btn-simple" @click="exportToPDF()" style="width: 100%">
                        <i class="tim-icons icon-cloud-download-93" style="font-size:18px; margin-right: 5px"> </i>
                        Export
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table tablesorter" :class="tableClass">
                  <thead class="text-primary">
                  <tr>
                    <slot name="columns" style="text-align: center">
                      <th v-for="(column, index) in tableColumns" :key="index" style="text-align:center">{{column.Header}}</th>
                    </slot>
                  </tr>
                  </thead>
                  <tbody :class="tbodyClasses">
                  <tr v-for="(item, index) in table.data" :key="index">
                    <slot :row="item">
                      <td v-for="(column, index) in tableColumns"
                          :key="index"
                          v-if="hasValue(item, column)" style="text-align:center">
                        <a href="#" v-if="column.Header === 'Id'">{{itemValue(item, column)}}</a>
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
  import moment from 'moment';
  import axios from 'axios';
  import config from '@/config';

  var pdfMake = require('pdfmake/build/pdfmake.js');
  var pdfFonts = require('pdfmake/build/vfs_fonts.js');
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    components: {
      DatePicker,
      VueBootstrapTypeahead
    },
    data() {
      return {
        table: {
          data: this.sales
        },
        hideFlag: false,
        tbodyClasses: '',
        searchCustomerName: '',
        username: "",
        userList: [],
        customerName: "",
        customerList: this.customers.map(arr => arr.customerName),
        searchType: 'selectAType',
        searchPaidAmount: '',
        searchPaidDateFrom: '',
        searchPaidDateTo: '',
        searchPaidTo: ''
      };
    },
    props: {
      sales: Array,
      customers: Array,
    },
    watch: {
      sales() {
        this.table.data = this.sales;
      },
      customers() {
        this.customerList = this.customers.map(arr => arr.customerName);
      },
      customerName() {
        if(this.customerName != this.searchCustomerName) {
          this.searchCustomerName = '';
        }
      },
      username() {
        if(this.username != this.searchPaidTo) {
          this.searchPaidTo = '';
        }
      },
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('Sales.tableColumns');
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
        if(column.Item == "amount") {
          return "PHP " + temp.toLocaleString();
        }
        return temp;
      },
      clearSearchType() {
        this.searchType = 'selectAType';
      },
      clearDate(element) {
        switch(element){
          case 'paidDateFrom': this.searchPaidDateFrom = '';
            break;
          case 'paidDateTo': this.searchPaidDateTo = '';
            break;
        }
      },
      selectCustomer() {
        this.searchCustomerName = this.customerName;
      },
      selectUser() {
        this.searchPaidTo = this.username;
      },
      exportToPDF() {
        var docDefinition = {
          header: {
            columns: [
              {text: "Sales Report", alignment: 'left', margin: 10, color: '#aaa'},
              {text: moment().format("MM/DD/YYYY").toString(), alignment: 'right', margin: 10, color: '#aaa'}
            ]
          },
          footer: {
              text: "© Hexamindz Corporation",
              alignment: 'right',
              color: '#aaa',
              margin: [0,0,10,0]
          },
          content: [
              {text: ' ', lineHeight: 1},
              {
                  table: {
                      headerRows: 1,
                      widths: [ '*', '*', '*', '*', '*'],

                      body: []
                  }
              }
          ]
        };
        var col = []
        //Table Header
        var checkerTableCol = this.tableColumns;
        for(var i = 0; i < checkerTableCol.length; i++) {
          var obj = {
            text: checkerTableCol[i].Header,
            bold: true
          }
          col.push(obj);
        }
        docDefinition.content[1].table.body.push(col);

        //Table Body
        for(var i=0;i<this.table.data.length;i++){
            var object = {
              customer: this.table.data[i].customer,
              salesType: this.table.data[i].salesType,
              amount: this.table.data[i].amount,
              createdDate: this.table.data[i].createdDate,
              createdBy: this.table.data[i].createdBy
            }
            docDefinition.content[1].table.body.push(Object.values(object));  
        }

        //Download PDF
        pdfMake.createPdf(docDefinition).download('Sales Report - ' + moment().format("MM/DD/YYYY").toString() + '.pdf');
      },
      search() {
        var baseurl = '/getSales?'
        var url = "";
        url += "paidAmount=" + this.searchPaidAmount;
        url += "&customerName=" + this.customerName;
        if(this.searchType == 'selectAType') {
          url += "&searchType=" + '';
        } else {
          url += "&searchType=" + this.searchType;
        }
        if(this.searchPaidDateFrom != '')
          url += "&paidDateFrom=" + (this.searchPaidDateFrom.getMonth() + 1) + '/' + this.searchPaidDateFrom.getDate() + '/' +  this.searchPaidDateFrom.getFullYear();
        else
          url += "&paidDateFrom=" + '';

        if(this.searchPaidDateTo != '')
          url += "&paidDateTo=" + (this.searchPaidDateTo.getMonth() + 1) + '/' + this.searchPaidDateTo.getDate() + '/' +  this.searchPaidDateTo.getFullYear();
        else
          url += "&paidDateTo=" + '';

        url += "&paidTo=" + this.username;
        
        axios
          .get(config.backend_host + (baseurl + url))
          .then(response => {
            if(response.data.statusCode === "OK"){
              for(var i = 0; i < response.data.data.length; i++) {
                response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
                response.data.data[i].termDueDate = moment(response.data.data[i].termDueDate).format("MM/DD/YYYY");
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
