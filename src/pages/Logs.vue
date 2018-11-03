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
              <div class="col-sm-9">
                <div class="btn-group btn-group-toggle"
                     :class="'float-right'" data-toggle="buttons">
                  <label v-for="(option, index) in logsCategories"
                         :key="option"
                         class="btn btn-sm btn-primary btn-simple"
                         :class="{active: table.activeIndex === index}"
                         :id="index">
                    <input type="radio"
                           @click="updateLogsTable(index)"
                           name="options" autocomplete="off"
                           :checked="table.activeIndex === index">
                    {{option}}
                  </label>
                </div>
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
                        <i class="tim-icons icon-paper text-info" 
                          style="font-weight: bold;display: inline-block;width: 20%;text-align: center; cursor:pointer" @click="toggleModal(item)">
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

    <sweet-modal ref="logDetailsModal" hide-close-button overlay-theme="dark" modal-theme="dark">  
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
        <div class="row form-group" v-if="category === 1">
          <div class="col-md-4" style="text-align: left">
            <label class="control-label">Customer Name </label>
          </div>
          <div class="col-md-8" style="text-align: left">
            <label class="control-label">{{ detailsData.Customer_Name }}</label>
          </div>
        </div>
        <card style="background-color: #2b3b4c">
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
        <div class="row form-group" v-if="category === 1">
          <div class="col-md-4" style="text-align: left">
            <label class="control-label">Total Amount </label>
          </div>
          <div class="col-md-8" style="text-align: left">
            <label class="control-label">{{ detailsData.Total_Amount }}</label>
          </div>
        </div>
        <div class="row form-group" v-if="category === 1">
          <div class="col-md-4" style="text-align: left">
            <label class="control-label">Purchased From </label>
          </div>
          <div class="col-md-8" style="text-align: left">
            <label class="control-label">{{ detailsData.Created_By }}</label>
          </div>
        </div>
      </div>
      <button slot="button" v-on:click="toggleModal" class="btn btn-sm btn-danger">Cancel</button>
    </sweet-modal>
  </div>
</template>
<script>

  import { SweetModal, SweetModalTab } from 'sweet-modal-vue';
  
  const tableDataIn = [
  {
    id: 1,
    Products: [
    {productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", price: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"},
    {productName: "Ganador", productCode: "GNDR", quantity: "10", unit: "Sack", price: "54.00", supplier: "Bugasan ni Juan", quantityAdded: "3" }],
    Created_Date: "11/01/2018",
    Created_By: "Admin"

  },
  {
    id: 2,
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", price: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 3,
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", price: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 4,
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", price: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  }
];
        
const tableDataOut = [
  {
    id: 5,
    Customer_Name: "Tala",
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", price: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Total_Amount: "30.00",
    Paid_Amount: "1000",
    Balance: "45.00",
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 6,
    Customer_Name: "Tala",
    Products: [{ productName: "NFA Rice", Product_Code: "NFA", quantity: "25", unit: "Kilo", price: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Total_Amount: "30.00",
    Paid_Amount: "1000",
    Balance: "45.00",
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 7,
    Customer_Name: "King",
    Products: [{ productName: "Ganador", productCode: "GNDR", quantity: "25", unit: "Kilo", price: "54.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Total_Amount: "1350.00",
    Paid_Amount: "1000",
    Balance: "1350.00",
    Created_Date: "11/03/2018",
    Created_By: "Humba"
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
          data: [...tableDataIn],
          activeIndex: 0
        },
        search: '',
        category: 0,
        tbodyClasses: '',
        tableColumns: this.$t('logs.tableColumnsIn'),
        modalFlag: false,
        activeIndexDetails: 0,
        detailsData: []
      };
    },
    watch: {
      search: function () {
        switch(this.category){
          case 0:
                if(this.search != '') {
                  this.table.data = [...tableDataIn].filter(item => 
                    this.itemValue(item, {Item: 'Products'}).toUpperCase().includes(this.search.toUpperCase())||
                    item.Created_Date.toUpperCase().includes(this.search.toUpperCase()) ||
                    item.Created_By.toUpperCase().includes(this.search.toUpperCase()));
                }
                else
                  this.table.data = [...tableDataIn];
                break;
          case 1:
                if(this.search != '') {
                  this.table.data = [...tableDataOut].filter(item => 
                    item.Customer_Name.toUpperCase().includes(this.search.toUpperCase()) || 
                    this.itemValue(item, {Item: 'Products'}).toUpperCase().includes(this.search.toUpperCase()) ||
                    item.Total_Amount.toString().includes(this.search) || 
                    item.Paid_Amount.toUpperCase().includes(this.search.toUpperCase()) ||  
                    item.Balance.toString().includes(this.search) || 
                    item.Created_Date.toUpperCase().includes(this.search.toUpperCase()) ||
                    item.Created_By.toUpperCase().includes(this.search.toUpperCase()));
                }
                else
                  this.table.data = [...tableDataOut];
                break;
        }
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      logsCategories() {
        return this.$t('logs.logsCategories');
      },
      detailsCategories() {
        return this.$t('logs.detailsCategories');
      },
      modalColumns() {
        return this.$t('logs.modalColumns');
      }
    },
    methods: {
      hasValue(item, column) {
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

        return temp;
      },
      updateLogsTable(index) {
        this.search = "";
        this.category = index;
        this.activeIndexDetails = 0;
        switch(index){
          case 0:
            this.tableColumns = this.$t('logs.tableColumnsIn');
            this.table.data = [...tableDataIn];
            break;
          case 1:
            this.tableColumns = this.$t('logs.tableColumnsOut');
            this.table.data = [...tableDataOut];
            break;
        }
        this.table.activeIndex = index;
      },
      toggleModal(item) {
        console.log("tada", item);
        this.detailsData = item;
        this.activeIndexDetails = 0;
        if(!this.modalFlag) {
          this.modalFlag = true;
          this.$refs.logDetailsModal.open();
        } else {
          this.modalFlag = false;
          this.$refs.logDetailsModal.close();
        }
      },
      updateDetailsCategory(index) {
        this.activeIndexDetails = index;
      }
    }
  };
</script>
<style>
</style>
