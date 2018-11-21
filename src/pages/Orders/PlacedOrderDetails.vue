<template>
  <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
    <div class="col-12">
      <card>
        <h3>Order Details</h3>
        <div class="row">
          <div class="col-md-7">
            <div style="padding-top: 10px">
              <label class="control-label" style="font-size: 15px">Customer Name </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 18px;"> {{customerName}}</label>
            </div>
          </div>
          <div class="col-md-3">
            <div style="padding-top: 10px;">
              <label class="control-label" style="font-size: 15px">Ordered from </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 18px;"> {{orderedFrom}}</label>
            </div>
          </div>
          <div class="col-md-2">
            <div style="padding-top: 10px">
              <label class="control-label" style="font-size: 15px">Ordered Date </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 18px;">{{orderedDate}}</label>
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
      <card>
        <h3>Order Status</h3>
        <step-progress :steps="steps" :current-step="currentStep"></step-progress>
      </card>
      <card v-if="showCardByUserType(regionalManager)">
        <h3>Regional Manager</h3>
        <div class="row">
          <div class="col-md-12">
            <label style="font-size: 1rem">I agree that this order will be approved. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eleifend, 
              ipsum vitae consectetur dapibus, felis lectus imperdiet elit, sed molestie nisi massa a ligula. Quisque lacus risus, 
              vehicula vitae ullamcorper efficitur, aliquet non diam. Etiam gravida, elit ac fermentum vehicula, ex ante commodo 
              sapien, sit amet convallis odio mi in velit.
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
        'Regional Manager', 'Accounting', 'Checker'
      ],
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
            if(this.purchaseOrderStatus == config.PO_STATUS_PENDING){
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
      //if(this.userType == userType)
      return (this.userType == type) && temp;
    },
    setQuantityIndex(index){
      this.quantityIndex = index;
    },
    rmApprove(flag) {
      var item = {
        salesLogsId: this.$route.params.id,
        approved: flag
      }
      this.$emit('regionalManagerApproved', item);
    },
    acctApprove(flag) {
      var date = this.termDueDate;
      var dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
      var item = {
        salesLogsId: this.$route.params.id,
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
    }
  },
  mounted() {
    var formData = new FormData();
    formData.append("id", this.$route.params.id)
    axios
        .post(config.backend_host + '/getSalesLogsById', formData)
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
              this.steps[2] = "Complete"
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
