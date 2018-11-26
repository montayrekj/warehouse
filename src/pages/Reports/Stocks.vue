<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card type="chart" style="max-height: calc(100vh - 88px); overflow: auto">
          <div>
            <div class="col-12">
              <div style="padding-bottom: 10px; width: 100%">
                <div class="row">
                  <div class="col-md-3" style="margin-bottom: 10px">
                    <input type="text" placeholder="Search" v-model="search" class="form-control" />
                  </div>
                  <div class="col-md-7"></div>
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
 
import moment from 'moment';

var pdfMake = require('pdfmake/build/pdfmake.js');
var pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  data() {
    return {
      table: {
        data: this.stocks
      },
      search: '',
      tbodyClasses: ''
    };
  },
  props: {
    stocks: Array
  },
  watch: {
    stocks() {
      this.table.data = this.stocks;
    },
    search: function () { 
      if(this.search != '') {
        this.table.data = this.stocks.filter(item => 
          item.productName.toUpperCase().includes(this.search.toUpperCase()) ||
          item.quantityIn.toString().includes(this.search) || 
          item.quantityOut.toString().includes(this.search));
      }
      else
        this.table.data = this.stocks;
    }
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
    tableColumns() {
      return this.$t('Stocks.tableColumns');
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
            {text: "Stocks Report", alignment: 'left', margin: 10, color: '#aaa'},
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
                    widths: [ '*', '*', '*'],

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
            productName: this.table.data[i].productName,
            quantityIn: this.table.data[i].quantityIn,
            quantityOut: this.table.data[i].quantityOut
          }
          docDefinition.content[1].table.body.push(Object.values(object));  
      }

      //Download PDF
      pdfMake.createPdf(docDefinition).download('Stocks Report - ' + moment().format("MM/DD/YYYY").toString() + '.pdf');
    }
  }
};
</script>
<style>
</style>
