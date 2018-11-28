<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card>
          <h4>Advanced Search</h4>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Customer Name</label>
              <input type="text" class="form-control"  placeholder="Enter customer name..." v-model="searchCustomerName" >
            </div>
            <div class="form-group col-md-4">
              <label>Type</label>
              <!--input type="text" class="form-control" placeholder="Select a type..." v-model="searchType" -->
              <select class="form-control" v-model="searchType">
                <option value="selectAType" disabled selected>Select a type...</option>
                <option value="Cash">Cash</option>
                <option value="Term">Term</option> 
              </select>
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
                    <date-picker :value="searchPaidDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
                <div class="form-group col-md-6">
                    <date-picker :value="searchPaidDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date to..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
              </div>
            </div>
            <div class="form-group col-md-4">
              <label>Paid To</label>
              <input type="text" class="form-control"  placeholder="Enter name..." v-model="searchPaidTo" >
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
  import moment from 'moment';

  var pdfMake = require('pdfmake/build/pdfmake.js');
  var pdfFonts = require('pdfmake/build/vfs_fonts.js');
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    components: {
      DatePicker
    },
    data() {
      return {
        table: {
          data: this.sales
        },
        tbodyClasses: '',
        searchCustomerName: '',
        searchType: 'selectAType',
        searchPaidAmount: '',
        searchPaidDateFrom: '',
        searchPaidDateTo: '',
        searchPaidTo: ''
      };
    },
    props: {
      sales: Array
    },
    watch: {
      sales() {
        this.table.data = this.sales;
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('Sales.tableColumns');
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

        return temp;
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
      }
    }
  };
</script>
<style>
</style>
