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
              <label>Order Id</label>
              <input type="number" class="form-control" placeholder="Enter order id..." v-model="searchOrderId" >
            </div>
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
              <label>Term Amount</label>
              <input type="number" class="form-control"  placeholder="Enter term amount..." v-model="searchTermAmount" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Term Due Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                    <div class="input-group">
                      <date-picker v-model="searchTermDueDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'" ref="dateFrom"></date-picker>
                      <div class="input-group-append eye-password" @click="clearDate('dueDateFrom')"><i class="fa fa-calendar-times"></i></div>
                    </div>
                </div>
                <div class="form-group col-md-6">
                  <div class="input-group">
                    <date-picker v-model="searchTermDueDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date to..." :format="'MM/dd/yyyy'"></date-picker>
                    <div class="input-group-append eye-password" @click="clearDate('dueDateTo')"><i class="fa fa-calendar-times"></i></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group col-md-4">
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
                      <th style="text-align:center">Action</th>
                    </slot>
                  </tr>
                  </thead>
                  <tbody :class="tbodyClasses">
                  <tr v-for="(item, index) in table.data" :key="index">
                    <slot :row="item">
                      <td v-for="(column, index) in tableColumns"
                          :key="index"
                          v-if="hasValue(item, column)" style="text-align:center">
                        <a href="#" v-if="column.Header === 'Order Id'">{{itemValue(item, column)}}</a>
                        <label v-if="column.Header !== 'Order Id'">{{itemValue(item, column)}}</label>
                      </td>
                      <td>
                        <button class="btn btn-success" style="width: 100%;" @click="toggleConfirmModal(item.orderId)">Collect</button>
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
    <sweet-modal ref="confirmModal" hide-close-button overlay-theme="dark" modal-theme="dark" icon="warning" :enable-mobile-fullscreen="false">
      Are you sure you have collected the term?
      <button slot="button" class="btn btn-success" @click="collect" style="width: 130px; margin-right:5px;">Yes</button>
      <button slot="button" class="btn btn-danger" @click="toggleConfirmModal(0)" style="width: 130px; margin-left:5px">No</button>
    </sweet-modal>
    <sweet-modal ref="errorExport" icon="error" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
      No data to be exported!
    </sweet-modal>
  </div>
</template>
<script>

  import { SweetModal, SweetModalTab } from 'sweet-modal-vue';
  import DatePicker from 'vuejs-datepicker';
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import moment from 'moment';
  import axios from 'axios';
  import config from '@/config'

  var pdfMake = require('pdfmake/build/pdfmake.js');
  var pdfFonts = require('pdfmake/build/vfs_fonts.js');
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    components: {
      SweetModal,
      SweetModalTab,
      DatePicker,
      VueBootstrapTypeahead
    },
    data() {
      return {
        table: {
          data: this.collections
        },
        hideFlag: false,
        tbodyClasses: '',
        confirmModalFlag: false,
        customerName: "",
        customerList: this.customers.map(arr => arr.customerName),
        username: "",
        userList: [],
        selectedOrderId: null,
        searchOrderId: '',
        searchCustomerName: '',
        searchTermAmount: '',
        searchTermDueDateFrom: '',
        searchTermDueDateTo: '',
        searchOrderedDateFrom: '',
        searchOrderedDateTo: '',
        searchOrderedFrom: ''
      };
    },
    props: {
      collections: Array,
      customers: Array
    },
    watch: {
      collections() {
        this.table.data = this.collections;
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
      tableColumns(){
        return this.$t('Collections.tableColumns');
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
        if(column.Item == "Balance")
          return this.computeBalance(item["Total_Amount"], item["Paid_Amount"]);
        else if(column.Item == "termAmount") {
          return "PHP " + temp.toLocaleString();
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
      clearDate(element) {
        switch(element){
          case 'dueDateFrom': this.searchTermDueDateFrom = '';
            break;
          case 'dueDateTo': this.searchTermDueDateTo = '';
            break;
          case 'orderedDateFrom': this.searchOrderedDateFrom = '';
            break;
          case 'orderedDateTo': this.searchOrderedDateTo = '';
            break;
        }
      },
      collect() {
        this.$emit('collectCollection', Number(this.selectedOrderId));
      },
      toggleConfirmModal(orderId) {
        if(!this.confirmModalFlag) {
          this.confirmModalFlag = true;
          this.selectedOrderId = orderId;
          this.$refs.confirmModal.open();
        } else {
          this.confirmModalFlag = false;
          this.selectedOrderId = null;
          this.$refs.confirmModal.close();
        }
      },
      exportToPDF() {
        if(this.table.data.length > 0) {
          var docDefinition = {
            header: {
              columns: [
                {text: "Collections' Report", alignment: 'left', margin: 10, color: '#aaa'},
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
                        widths: [ '*', '*', '*', '*', '*', '*'],

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
                orderId: this.table.data[i].orderId,
                customer: this.table.data[i].customer,
                termAmount: this.table.data[i].termAmount,
                termDueDate: this.table.data[i].termDueDate,
                createdDate: this.table.data[i].createdDate,
                createdBy: this.table.data[i].createdBy
              }
              docDefinition.content[1].table.body.push(Object.values(object));  
          }

          //Download PDF
          pdfMake.createPdf(docDefinition).download('Collections Report - ' + moment().format("MM/DD/YYYY").toString() + '.pdf');
        } else {
          this.$refs.errorExport.open();
        }
      },
      selectCustomer() {
        this.searchCustomerName = this.customerName;
      },
      selectUser() {
        this.searchOrderedFrom = this.username;
      },
      search() {
        var baseurl = '/getCollections?'
        var url = "";
        url += "orderId=" + this.searchOrderId
        url += "&customerName=" + this.customerName
        url += "&termAmount=" + this.searchTermAmount
        if(this.searchTermDueDateFrom != '')
          url += "&termDueDateFrom=" + (this.searchTermDueDateFrom.getMonth() + 1) + '/' + this.searchTermDueDateFrom.getDate() + '/' +  this.searchTermDueDateFrom.getFullYear();
        else
          url += "&termDueDateFrom=" + '';

        if(this.searchTermDueDateTo != '')
          url += "&termDueDateTo=" + (this.searchTermDueDateTo.getMonth() + 1) + '/' + this.searchTermDueDateTo.getDate() + '/' +  this.searchTermDueDateTo.getFullYear();
        else
          url += "&termDueDateTo=" + '';

        if(this.searchOrderedDateFrom != '')
          url += "&orderedDateFrom=" + (this.searchOrderedDateFrom.getMonth() + 1) + '/' + this.searchOrderedDateFrom.getDate() + '/' +  this.searchOrderedDateFrom.getFullYear();
        else
          url += "&orderedDateFrom=" + '';

        if(this.searchOrderedDateTo != '')
          url += "&orderedDateTo=" + (this.searchOrderedDateTo.getMonth() + 1) + '/' + this.searchOrderedDateTo.getDate() + '/' +  this.searchOrderedDateTo.getFullYear();
        else
          url += "&orderedDateTo=" + '';

        url += "&orderedFrom=" + this.username
        
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
