<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card type="chart" style="max-height: calc(100vh - 88px); overflow: auto">
          <template slot="header">
            <div class="row">
              <div class="col-sm-3">
                <input type="text" placeholder="Search" v-model="search" class="form-control" />
              </div>
            </div>
          </template>
          <div>
            <div class="col-12">
              <div class="table-responsive">
                <table class="table tablesorter" :class="tableClass">
                  <thead class="text-primary">
                  <tr>
                    <slot name="columns" style="text-align: center">
                      <th v-for="(column, index) in tableColumns" :key="index">{{column.Header}}</th>
                      <th style="display: inline-block;width: 100%;text-align: center;">Actions</th>
                    </slot>
                  </tr>
                  </thead>
                  <tbody :class="tbodyClasses">
                  <tr v-for="(item, index) in table.data" :key="index">
                    <slot :row="item">
                      <td v-for="(column, index) in tableColumns"
                          :key="index"
                          v-if="hasValue(item, column)">
                        {{itemValue(item, column)}}
                      </td>
                      <td style="text-align: center">
                        <i data-toggle="tooltip" data-placement="bottom" title="View details" 
                          class="tim-icons icon-paper text-info" 
                          style="font-weight: bold;display: inline-block;width: 20%;text-align: center; cursor:pointer" 
                          @click="toggleModal(item)">
                        </i>
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

    <sweet-modal ref="viewDetailsModal" hide-close-button overlay-theme="dark" modal-theme="dark">  
      <div class="row" style="padding-bottom: 20px">
        <div class="col-sm-12">
          <div class="btn-group btn-group-toggle"
                :class="'float-right'" data-toggle="buttons">
            <label v-for="(option, index) in detailsCategories"
                    :key="option"
                    class="btn btn-sm btn-primary btn-simple"
                    :class="{active: activeIndexDetails === index}"
                    :id="index">
              <input type="radio"
                      @click="updateDetailsCategory(index)"
                      name="options" autocomplete="off"
                      :checked="activeIndexDetails === index">
              {{option}}
            </label>
          </div>
        </div>
      </div>
      <div v-if="activeIndexDetails === 0">
        <div class="row form-group">
          <div class="col">
            <div class="div-content-align"><label style="font-size: 11px; color:rgba(255, 255, 255, 0.6)">Customer Name </label></div>
            <div class="div-content-align"><label class="control-label">{{ detailsData.Customer_Name }}</label></div>
          </div>
        </div>
        <card class="card-body-color">
          <div class="table-responsive">
            <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
                <tr>
                  <slot name="columns">
                    <th v-for="(column, index) in modalColumns" :key="index">{{column.Header}}</th>
                  </slot>
                </tr>
              </thead>
              <tbody :class="tbodyClasses">
                <tr v-for="(i, index) in detailsData.Products" :key="index">
                  <slot :row="i">
                    <td v-for="(column, index) in modalColumns"
                        :key="index"
                        v-if="hasValue(i, column)">
                      {{itemValue(i, column)}}
                    </td>
                  </slot>
                </tr>
              </tbody>
            </table>
          </div>
        </card>
        <div>
          <div class="row">
            <div class="col-md-4">
              <div class="col">
                <div class="div-content-align"><label class="label-title-content">Total Amount </label></div>
                <div class="div-content-align"><label class="control-label">{{ detailsData.Total_Amount }}</label></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="col">
                <div class="div-content-align"><label class="label-title-content">Total Paid Amount </label></div>
                <div class="div-content-align"><label class="control-label">{{ detailsData.Paid_Amount }}</label></div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="col">
                <div class="div-content-align"><label class="label-title-content">Balance </label></div>
                <div class="div-content-align"><label class="control-label">{{ computeBalance(detailsData.Total_Amount, detailsData.Paid_Amount) }}</label></div>
              </div>
            </div>
          </div>
          <div>
            <div class="col">
              <div class="div-content-align"><label class="label-title-content">Purchased From </label></div>
              <div class="div-content-align"><label class="control-label">{{ detailsData.Created_By }}</label></div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="activeIndexDetails === 1">
        <card v-for="(history, index) in paymentHistory" :key="index" class="card-body-color">
          <div class="col">
            <div class="row">
              <div class="col">
                <div><label class="label-content-size">Payment Method</label></div>
                <div><label  class="label-content-color">{{ history.Payment_Method }}</label></div>
              </div>
              <div class="col" v-if="history.Payment_Method.includes('Cash')">
                <div><label class="label-content-size">Amount in Cash</label></div>
                <div><label  class="label-content-color">{{ history.amountInCash }}</label></div>
              </div>
            </div>
            <div class="row" v-if="history.Payment_Method.includes('Cheque')">
              <div class="col">
                <div><label class="label-content-size">Amount in Cheque</label></div>
                <div><label class="label-content-color">{{ history.amountInCheque }}</label></div>
              </div>
              <div class="col">
                <div><label class="label-content-size">Cheque Due Date</label></div>
                <div><label class="label-content-color">{{ history.Cheque_Due_Date }}</label></div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div><label class="label-content-size">Total Paid Amount</label></div>
                <div><label class="label-content-color">{{ (history.amountInCheque + history.amountInCash) }}</label></div>
              </div>
              <div class="col">
                <div><label class="label-content-size">Balance</label></div>
                <div><label class="label-content-color">{{ history.Balance}}</label></div>
              </div>
            </div>
            
            <div style="text-align: right;"><label class="label-content-size label-content-style">{{history.Created_By + " - " + history.Created_Date}}</label></div>
          </div>
        </card>
        <card class="card-body-color" v-if="paymentHistory.length == 0">
          <div><label>No Payment Added</label></div>
        </card>
      </div>
      <button slot="button" v-on:click="toggleModal" class="btn btn-sm btn-danger">Cancel</button>
    </sweet-modal>
  </div>
</template>
<script>

import { SweetModal, SweetModalTab } from 'sweet-modal-vue';
        
const tableData = [
  {
    id: 1,
    Customer_Name: "Teresita Tala P. Rabago",
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", sellPrice: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Total_Amount: "30.00",
    Paid_Amount: "1000",
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 2,
    Customer_Name: "Teresita Tala P. Rabago",
    Products: [{ productName: "NFA Rice", Product_Code: "NFA", quantity: "25", unit: "Kilo", sellPrice: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Total_Amount: "30.00",
    Paid_Amount: "1000",
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 3,
    Customer_Name: "King Joshua M. Montayre",
    Products: [{ productName: "Ganador", productCode: "GNDR", quantity: "25", unit: "Kilo", sellPrice: "54.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Total_Amount: "1350.00",
    Paid_Amount: "1000",
    Created_Date: "11/03/2018",
    Created_By: "Humba"
  }
];

const tablePaymentHistory = [
  {
    id: 1,
    Payment_Method: "Cash",
    Payment_Type: "Partial",
    amountInCash: 1000,
    amountInCheque: 0.00,
    Balance: 45.00,
    Cheque_Due_Date: "",
    OutLogsId: 1,
    Created_Date: "11/01/2018",
    Created_By: "Tala"
  },
  {
    id: 2,
    Payment_Method: "Cheque",
    amountInCash: 0,
    amountInCheque: 45.00,
    Balance: 0,
    Cheque_Due_Date: "11/03/2018",
    OutLogsId: 1,
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 3,
    Payment_Method: "Cash, Cheque",
    Payment_Type: "Full",
    amountInCash: 500.00,
    amountInCheque: 500.00,
    Balance: 0,
    Cheque_Due_Date: "11/04/2018",
    OutLogsId: 1,
    Created_Date: "11/01/2018",
    Created_By: "King"
  }
];

  export default {
    components: {
      SweetModal,
      SweetModalTab
    },
    data() {
      return {
        table: {
          data: [...tableData] 
        },
        search: '',
        tbodyClasses: '',
        modalFlag: false,
        activeIndexDetails: 0,
        detailsData: [],
        paymentHistory: []
      };
    },
    watch: {
      search: function () {
          if(this.search != '') {
            this.table.data = [...tableData].filter(item => 
              item.Customer_Name.toUpperCase().includes(this.search.toUpperCase()) || 
              this.itemValue(item, {Item: 'Products'}).toUpperCase().includes(this.search.toUpperCase()) ||
              item.Total_Amount.toString().includes(this.search) || 
              item.Paid_Amount.toUpperCase().includes(this.search.toUpperCase()) ||  
              this.computeBalance(item.Total_Amount,item.Paid_Amount).toString().includes(this.search) || 
              item.Created_Date.toUpperCase().includes(this.search.toUpperCase()) ||
              item.Created_By.toUpperCase().includes(this.search.toUpperCase()));
          }
          else
            this.table.data = [...tableData];
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('sales.tableColumns');
      },
      detailsCategories() {
        return this.$t('sales.detailsCategories');
      },
      modalColumns() {
        return this.$t('sales.modalColumns');
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
        if(column.Item === "Products"){
          temp = "";
          for(var i = 0 ; i < item[column.Item].length; i++){
            temp = temp + item[column.Item][i].productName + ", ";
          }
        }
        else if(column.Item == "Balance")
          return this.computeBalance(item["Total_Amount"], item["Paid_Amount"]);

        return temp;
      },
      toggleModal(item) {
        this.detailsData = item;
        this.activeIndexDetails = 0;
        if(!this.modalFlag) {
          this.paymentHistory = this.getPaymentHistory();
          this.modalFlag = true;
          this.$refs.viewDetailsModal.open();
        } else {
          this.modalFlag = false;
          this.$refs.viewDetailsModal.close();
        }
      },
      updateDetailsCategory(index) {
        this.activeIndexDetails = index;
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
      getPaymentHistory() {
        return [...tablePaymentHistory].filter(item => 
          item.OutLogsId.toString().includes(this.detailsData.id.toString()));
      }
    }
  };
</script>
<style>
</style>
