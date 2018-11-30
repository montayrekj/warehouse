<template>
  <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
    <div class="col-12">
      <card>
        <h3>Order Status</h3>
        <step-progress :steps="steps" :current-step="currentStep" :icon-class="stepperIcon"></step-progress>
      </card>
      <card>
        <h3>Order Details</h3>
        <div class="row">
          <div class="col-md-7">
            <div style="padding-top: 10px">
              <label class="control-label" style="font-size: 14px">Customer Name </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 16px; font-style: italic"> {{customerName}}</label>
            </div>
          </div>
          <div class="col-md-3">
            <div style="padding-top: 10px;">
              <label class="control-label" style="font-size: 14px">Ordered from </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 16px; font-style: italic"> {{orderedFrom}}</label>
            </div>
          </div>
          <div class="col-md-2">
            <div style="padding-top: 10px">
              <label class="control-label" style="font-size: 14px">Ordered Date </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 16px; font-style: italic">{{orderedDate}}</label>
            </div>
          </div>
        </div>
        <br>
        <br>
        <div class="table-responsive">
          <table class="table tablesorter">
            <thead class="text-primary">
            <tr style="position: sticky; top: 0;">
              <slot name="columns" >
                <th v-for="(column, index) in tableColumns" :key="index" style="text-align: center;">{{column.Header}}</th>
              </slot>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(item,indexTemp) in table.data" :key="indexTemp">
                <slot :row="item">
                  <td v-for="(column, index) in tableColumns"
                      :key="index"
                      v-if="hasValue(item, column)" style="text-align: center">
                    {{itemValue(item, column)}}
                  </td>
                </slot>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="dropdown-divider" style="border-top: 1px solid #3d3f52"></div>
        <div class="row">
          <div class="col-xl-8"></div>
          <div class="col-xl-3">
            <label style="text-align:center; font-weight:bold; padding-top: 20px;font-size: 14px;color: #bfbfc5;">TOTAL AMOUNT</label>
            <label style="text-align:center; font-weight:bold; padding-top: 20px;font-size: 14px; color: #bfbfc5; float:right">{{totalAmount}}</label>
          </div>  
        </div>
      </card>
      <card v-if="showCardByUserType(regionalManager)">
        <h3>Regional Manager</h3>
        <div class="row">
          <div class="col-md-12">
            <label style="font-size: 1rem"> 
              I have carefully and eagerly reviewed this order, and I duly agree that this order will be approved and shall be transfered to Accounting for payment processing and approval.
            </label>
          </div>
          <div class="col-xl-8"></div>
          <div class="col-xl-2" style="margin-top: 20px;">
            <button class="btn btn-success" @click="rmApprove(true)" style="width:100%;">Approve</button>
          </div>
          <div class="col-xl-2" style="margin-top: 20px;">
            <button class="btn btn-danger" @click="rmApprove(false)" style="width:100%;">Decline</button>
          </div>
        </div>
      </card>
      <card v-if="showCardByUserType(accounting)">
        <h3>Accounting</h3>
        <div class="row">
          <div class="form-group col-md-12">
            <label for="customerName" class="add-customer-label pull-left">Cash Amount</label>
            <input type="text" class="form-control" placeholder="Enter cash ammount..." v-model="cashAmount" >
          </div>
        </div>
        <div class="row">
          <div class="form-group col-md-12">
            <label for="address" class="add-customer-label pull-left">Term Amount</label>
            <input type="text" class="form-control color-grey" placeholder="Enter term amount..." v-model="termAmount" disabled>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-md-12">
            <label for="contactNo" class="add-customer-label pull-left">Term Due Date</label>
            <date-picker :value="termDueDate" :input-class="'form-control input-calendar-color'" :format="'MM/dd/yyyy'"></date-picker>
          </div>
        </div>
        <div class="row">
          <div class="col-xl-8"></div>
          <div class="col-xl-2" style="margin-top: 20px;">
            <button class="btn btn-success" @click="acctApprove(true)" style="width:100%;">Approve</button>
          </div>
          <div class="col-xl-2" style="margin-top: 20px;">
            <button class="btn btn-danger" @click="acctApprove(false)" style="width:100%;">Decline</button>
          </div>
        </div>
      </card>
      <card v-if="showCardByUserType(checker)">
        <h3>Checker</h3>
        <div class="table-responsive">
          <table class="table tablesorter">
            <thead class="text-primary">
            <tr>
              <slot name="columns" >
                <th v-for="(column, index) in checkerTableColumns" :key="index" style="text-align: center;">{{column.Header}}</th>
                <th style="text-align: center">Quantity Out</th>
              </slot>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(item,indexTemp) in table.data" :key="indexTemp">
                <slot :row="item">
                  <td v-for="(column, index) in checkerTableColumns"
                      :key="index"
                      v-if="hasValue(item, column)" style="text-align: center"
                      :style="column.Header == 'Quantity Left'? 'width: 20%':''">
                    <span v-if="column.Header != 'Quantity Left'">{{itemValue(item, column)}}</span>
                    <input v-if="column.Header == 'Quantity Left'" 
                        type="number" 
                        class="form-control color-grey" 
                        id="stockQuantity" min="0" v-model="quantityLeft[indexTemp]" disabled>
                  </td>
                  <td width="20%">
                    <input type="number" class="form-control" id="stockQuantity" style="background-color: #1c2a38;" min="0" 
                    v-model="quantityOut[indexTemp]" @focus="setQuantityIndex(indexTemp)">
                  </td>
                </slot>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="dropdown-divider" style="border-top: 1px solid #3d3f52"></div>
        <div class="row">
          <div class="col-xl-10"></div>
          <div class="col-xl-2" style="margin-top: 20px;">
            <button class="btn btn-success" @click="confirmChecker()" style="width:100%;">Confirm</button>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>
<script>
  import axios from 'axios';
  import config from '@/config'
  import moment from 'moment';
  import DatePicker from 'vuejs-datepicker'
  import StepProgress from 'vue-step-progress';
  import 'vue-step-progress/dist/main.css';

  import { POINT_CONVERSION_COMPRESSED } from 'constants';

  var pdfMake = require('pdfmake/build/pdfmake.js');
  var pdfFonts = require('pdfmake/build/vfs_fonts.js');
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  export default {
    

    components: {
      DatePicker,
      StepProgress
    },
    data() {
      return {
        table: {
          data: [],
        },
        salesLogsModel: null,
        customerName: "",
        orderedFrom: "",
        orderedDate: "",
        cashAmount: 0.0,
        termDueDate: new Date(),
        userType: null,
        purchaseOrderStatus: null,
        quantityLeft: [],
        quantityOut: [],
        quantityIndex: null,
        steps: [
          'Regional Manager', 'Accounting', 'Checker', 'Closed'
        ],
        stepperIcon: "fa fa-check",
        currentStep: 0,
      }
    },
    watch: {
      quantityOut() {
        if(this.quantityIndex != null) {
          this.quantityLeft[this.quantityIndex] = this.table.data[this.quantityIndex].quantityLeft;
          var val = this.quantityOut[this.quantityIndex];
          if(val < 0){
            this.quantityOut[this.quantityIndex] = 0;
          } else if(val > Number(this.table.data[this.quantityIndex].quantityLeft)){
            this.quantityOut[this.quantityIndex] = this.table.data[this.quantityIndex].quantityLeft;
          }
          this.quantityLeft[this.quantityIndex] = this.quantityLeft[this.quantityIndex] - this.quantityOut[this.quantityIndex];
          this.$forceUpdate();
        }
      }
    },
    computed: {
      tableColumns() {
        return this.$t('PlacedOrderDetails.tableColumns');
      },
      checkerTableColumns() {
        return this.$t('PlacedOrderDetails.checkerTableColumns');
      },
      regionalManager() {
        return this.$t('userType.regionalManager')
      },
      accounting() {
        return this.$t('userType.accounting')
      },
      checker() {
        return this.$t('userType.checker')
      },
      admin() {
        return this.$t('userType.admin')
      },
      totalAmount() {
        var total = 0.0;
        for(var i = 0; i < this.table.data.length; i++) {
          total += this.table.data[i].sellPrice * this.table.data[i].quantitySold;
        }
        return total.toFixed(2);
      },
      termAmount() {
        return this.totalAmount - this.cashAmount;
      }
    },
    methods: {
      hasValue(item, column) {
        return item[column.Item] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.Item];
      },
      showCardByUserType(type){
        //return userType == this.userType;
        var temp = false;
        if(this.userType != null){
          switch(this.userType.toString()){
            case this.regionalManager:
              if(this.purchaseOrderStatus == config.PO_STATUS_PENDING || this.purchaseOrderStatus == config.PO_STATUS_RM_APPROVED || this.purchaseOrderStatus == config.PO_STATUS_ACCT_APPROVED){
                temp = true;
              }
              break;
            case this.accounting:
              if(this.purchaseOrderStatus == config.PO_STATUS_RM_APPROVED){
                temp = true;
              }
              break;
            case this.checker:
              if(this.purchaseOrderStatus == config.PO_STATUS_ACCT_APPROVED){
                temp = true;
              }
              break;
            case this.admin:
              break;
          }
        }

        if(this.userType == this.regionalManager) {
          if(this.purchaseOrderStatus == type) {
            temp = true;
          } else {
            temp = false;
          }
        }
        
        return (this.userType == type || this.userType == this.regionalManager) && temp;
      },
      setQuantityIndex(index){
        this.quantityIndex = index;
      },
      rmApprove(flag) {
        var item = {
          orderId: this.$route.params.id,
          approved: flag
        }
        this.$emit('regionalManagerApproved', item);
      },
      acctApprove(flag) {
        var date = this.termDueDate;
        var dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
        var item = {
          orderId: this.$route.params.id,
          approved: flag,
          cashAmount: this.cashAmount,
          termAmount: this.termAmount,
          termDueDate: dateString.toString()
        }
        this.$emit('accountingApproved', item);
      },
      confirmChecker() {
        for(var i = 0; i < this.table.data.length; i++) {
          this.table.data[i].quantityLeft = this.quantityLeft[i];
        }

        this.salesLogsModel.salesLogsItem = this.table.data;
        this.$emit('checkerConfirmOrder', this.salesLogsModel);
        if(this.table.data.length <= 10)
          this.createPDF("Customer's Copy");
        else {
          this.createPDF("Customer's Copy");
          this.createPDF("Guard's Copy");
        }
      },
      createPDF(title) {
        var user = JSON.parse(localStorage.getItem("user"))
        var signature = "Customer's Signature Over Printed Name"
        if(this.table.data.length <= 10) {
          var halfPageBreak = 12 - this.table.data.length;
          var rectHeight = (halfPageBreak * 10) + ((halfPageBreak * 10) - 10);
        } else {
          var rectHeight = 0;
        }
        var docDefinition = {
          pageSize: 'A4',
          header: {
            columns: [
              {text: title, alignment: 'left', margin: [40,10,10,10], color: '#aaa'},
              {text: moment().format("MM/DD/YYYY").toString(), alignment: 'right', margin: [10,10,40,10], color: '#aaa'}
            ]
          },
          content: [
              {
                text: 'Checker: ' + user.username,
                alignment: 'left'
              },
              {text: ' ', lineHeight: 1},
              {
                  table: {
                      headerRows: 1,
                      widths: [ '*', '15%', '15%'],

                      body: []
                  },
              },
              {text: ' ', lineHeight: 4},
              {
              canvas: [
                  {
                      type: 'rect',
                      x: 0,
                      y: 0,
                      w: 517,
                      h: rectHeight,
                      r: 4,
                      lineColor: '#fff',
                  }
                ]
              },
              {text: signature, 
                  alignment: 'right', 
                  decoration: 'overline', 
                  decorationStyle: 'solid',
                      decorationColor: 'black',
                      color: 'white',
                      lineHeight: 0.5
              },
              {text: signature, 
                  alignment: 'right', 
              },
              // Half Page
              {text: '', lineHeight: 1},
              // Half Page
              {text: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', lineHeight: 1, margin: [0, 5, 0, 5]},
              {
                columns: [
                  {text: "Guard's Copy", alignment: 'left', color: '#aaa'},
                  {text: moment().format("MM/DD/YYYY").toString(), alignment: 'right', color: '#aaa'}
                ]
              },
              {text: ' ', lineHeight: 1},
              {
                text: 'Checker: ' + user.username,
                alignment: 'left'
              },
              {text: ' ', lineHeight: 1},
              {
                  table: {
                      headerRows: 1,
                      widths: [ '*', '15%', '15%'],

                      body: []
                  }
              },
              {text: ' ', lineHeight: 4},
              {
              canvas: [
                  {
                      type: 'rect',
                      x: 0,
                      y: 0,
                      w: 517,
                      h: rectHeight,
                      r: 4,
                      lineColor: '#fff',
                  }
                ]
              },
              {text: signature, 
                  alignment: 'right', 
                  decoration: 'overline', 
                  decorationStyle: 'solid',
                      decorationColor: 'black',
                      color: 'white',
                      lineHeight: 0.5
              },
              {text: signature, 
                  alignment: 'right', 
              },
          ]
        };
        

        var col = []
        //Table Header
        var checkerTableCol = this.$t('PlacedOrderDetails.pdfTableColumns');
        for(var i = 0; i < checkerTableCol.length; i++) {
          var obj = {
            text: checkerTableCol[i].Header,
            bold: true
          }
          col.push(obj);
        }
        docDefinition.content[2].table.body.push(col);

        //Table Body
        for(var i=0;i<this.table.data.length;i++){
            var object = {
              productName: this.table.data[i].productName,
              quantitySold: this.quantityOut[i],
              quantityLeft: this.quantityLeft[i],
            }
            docDefinition.content[2].table.body.push(Object.values(object));  
        }

        if(this.table.data.length <= 10) {
          var col = []
          //Table Header
          var checkerTableCol = this.$t('PlacedOrderDetails.pdfTableColumns');
          for(var i = 0; i < checkerTableCol.length; i++) {
            var obj = {
              text: checkerTableCol[i].Header,
              bold: true
            }
            col.push(obj);
          }
          docDefinition.content[13].table.body.push(col);

          //Table Body
          for(var i=0;i<this.table.data.length;i++){
              var object = {
                productName: this.table.data[i].productName,
                quantitySold: this.quantityOut[i],
                quantityLeft: this.quantityLeft[i],
              }
              docDefinition.content[13].table.body.push(Object.values(object));  
          }
        } else {
          docDefinition.content.length = 7;
        }

        if(this.table.data.length <= 10) {
          pdfMake.createPdf(docDefinition).download("Gate Pass - " + moment().format("MM/DD/YYYY").toString() + '.pdf');
        } else {
          pdfMake.createPdf(docDefinition).download("Gate Pass(" + title + ") - " + moment().format("MM/DD/YYYY").toString() +'.pdf');
        }
        var data;
        pdfMake.createPdf(docDefinition).getBase64(function(encodedString) {
            data = encodedString;
            var formData = new FormData();
            var user = JSON.parse(localStorage.getItem("user"))
            formData.append("userId", user.userId);
            formData.append("orderId", this.$route.params.id);
            formData.append("file", data);
            
            axios
              .post(config.backend_host + '/sendGatePass', formData)
              .then(response => {
                if(response.data.statusCode === "OK"){
                  
                }
              })
        });
      }
    },
    mounted() {
      var formData = new FormData();
      formData.append("id", this.$route.params.id)
      axios
          .post(config.backend_host + '/getOrderById', formData)
          .then(response => {
            if(response.data.statusCode === "OK"){
              this.salesLogsModel = response.data.data;
              this.table.data = response.data.data.salesLogsItem;
              for(var i = 0; i < this.table.data.length; i++) {
                this.quantityLeft.push(this.table.data[i].quantityLeft)
                this.quantityOut.push(0);
              }
              this.orderedFrom = response.data.data.createdBy;
              this.customerName = response.data.data.customer;
              this.orderedDate =  moment(response.data.data.createdDate).format("MM/DD/YYYY");
              this.purchaseOrderStatus = response.data.data.purchaseOrderStatus;
              this.currentStep = this.purchaseOrderStatus;
              if(this.purchaseOrderStatus === 3){
                this.currentStep = 4;
              } else if(this.purchaseOrderStatus < 0){
                this.currentStep = 4;
                this.stepperIcon = "fa fa-times"
              }
            }
          })

      var user = JSON.parse(localStorage.getItem("user"))
      this.userType = Number(user.usertype);
    }
  };
</script>
<style>
</style>
