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
              <label>Term Amount</label>
              <input type="text" class="form-control"  placeholder="Enter term amount..." v-model="searchTermAmount" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Term Due Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                    <date-picker :value="searchTermDueDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
                <div class="form-group col-md-6">
                    <date-picker :value="searchTermDueDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date to..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
              </div>
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
    <sweet-modal ref="confirmModal" hide-close-button overlay-theme="dark" modal-theme="dark" icon="warning">
      Are you sure you have collected the term?
      <button slot="button" class="btn btn-success" @click="collect" style="width: 130px; margin-right:5px;">Yes</button>
      <button slot="button" class="btn btn-danger" @click="toggleConfirmModal(0)" style="width: 130px; margin-left:5px">No</button>
    </sweet-modal>
  </div>
</template>
<script>
import { SweetModal, SweetModalTab } from 'sweet-modal-vue';
import DatePicker from 'vuejs-datepicker';
import moment from 'moment';

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  components: {
    SweetModal,
    SweetModalTab,
    DatePicker
  },
  data() {
    return {
      table: {
        data: this.collections
      },
      search: '',
      tbodyClasses: '',
      confirmModalFlag: false,
      selectedOrderId: null,
      searchOrderId: '',
      searchCustomerName: '',
      searchTermAmount: '',
      searchTermDueDateFrom: null,
      searchTermDueDateTo: null,
      searchOrderedDateFrom: null,
      searchOrderedDateTo: null,
      searchOrderedFrom: ''
    };
  },
  props: {
    collections: Array
  },
  watch: {
    collections() {
      this.table.data = this.collections;
    }
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
    tableColumns(){
      return this.$t('Collections.tableColumns');
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
    }
  }
};
</script>
<style>
</style>
