<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card :style="hide">
          <h4>Advanced Search 
            <i class="advanced-search-icon" :class="searchIcon" @click="hideFlag = !hideFlag"></i>
          </h4>
          <div class="row">
            <div class="form-group col-md-6">
              <label>Product Name</label>
              <input type="text" class="form-control"  placeholder="Enter product name..." v-model="searchProductName" >
            </div>
            <!--div class="form-group col-md-6">
              <label>Date</label>
              <div class="row">
                <div class="form-group col-md-6">
                    <date-picker v-model="searchDateFrom" :input-class="'form-control input-calendar-color'" placeholder= "Enter date from..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
                <div class="form-group col-md-6">
                    <date-picker :value="searchDateTo" :input-class="'form-control input-calendar-color'" placeholder= "Enter date to..." :format="'MM/dd/yyyy'"></date-picker>
                </div>
              </div>
            </div-->
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
    <sweet-modal ref="errorExport" icon="error" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
      No data to be exported!
    </sweet-modal>
  </div>
</template>
<script>
 
  import DatePicker from 'vuejs-datepicker'; 
  import axios from 'axios';
  import config from '@/config';
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
          data: this.stocks
        },
        hideFlag: false,
        tbodyClasses: '',
        searchProductName: '',
        searchDateFrom: '',
        searchDateTo: ''
      };
    },
    props: {
      stocks: Array
    },
    watch: {
      stocks() {
        this.table.data = this.stocks;
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('Stocks.tableColumns');
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
        if(column.Item == "quantityIn" || column.Item == "quantityOut") {
          return temp.toLocaleString();
        }
        return temp;
      },
      exportToPDF() {
        if(this.table.data.length > 0) {
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
        } else {
          this.$refs.errorExport.open();
        }
      },
      search() {
        var baseurl = '/getStocks?'
        var url = "";
        url += "productName=" + this.searchProductName;

        /*if(this.searchDateFrom != '')
          url += "&dateFrom=" + (this.searchDateFrom.getMonth() + 1) + '/' + this.searchDateFrom.getDate() + '/' +  this.searchDateFrom.getFullYear();
        else
          url += "&dateFrom=" + '';

        if(this.searchDateTo != '')
          url += "&dateTo=" + (this.searchDateTo.getMonth() + 1) + '/' + this.searchDateTo.getDate() + '/' +  this.searchDateTo.getFullYear();
        else
          url += "&dateTo=" + '';*/
        
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
    }
  };
</script>
<style>
</style>
