<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card type="chart" style="max-height: calc(100vh - 88px); overflow: auto">
          <div>
            <div class="col-12">
              <div class="table-responsive">
                <table class="table tablesorter" :class="tableClass">
                  <thead class="text-primary">
                  <tr>
                    <slot name="columns" style="text-align: center">
                      <th v-for="(column, index) in tableColumns" :key="index" style="text-align: center;">{{column.Header}}</th>
                    </slot>
                  </tr>
                  </thead>
                  <tbody :class="tbodyClasses">
                  <tr>
                    <td> <input type="text" placeholder="Search" v-model="searchId" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchCustomerName" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchTotalAmount" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchPaidAmount" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchBalance" class="form-control"/> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchOrderedDate" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchOrderedFrom" class="form-control" /> </td>
                  </tr>
                  <tr v-for="(item, index) in table.data" :key="index">
                    <slot :row="item">
                      <td v-for="(column, index) in tableColumns"
                          :key="index"
                          v-if="hasValue(item, column)" style="text-align: center;">
                        <a v-bind:href="'/#/logs/sales/' + item.salesLogsId" v-if="column.Header === 'Id'">{{itemValue(item, column)}}</a>
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
export default {
  data() {
    return {
      table: {
        data: this.sales
      },
      tbodyClasses: '',
      searchId: '',
      searchCustomerName: '',
      searchTotalAmount: '',
      searchPaidAmount: '',
      searchBalance: '',
      searchOrderedDate: '',
      searchOrderedFrom: ''
    };
  },
  props: {
    sales: Array
  },
  watch: {
    sales: function() {
      this.table.data = this.sales;
    },
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
    },
    searchId: function () {
      if(this.searchId != '') {
        this.table.data = [...tableData].filter(item => 
          item.id.toString().includes(this.searchId));
      }
      else
        this.table.data = [...tableData];

      this.updateFilteredTable("searchId");
    },
    searchCustomerName: function () {
      if(this.searchCustomerName != '') {
        this.table.data = [...tableData].filter(item => 
          item.Customer_Name.toUpperCase().includes(this.searchCustomerName.toUpperCase()));
      }
      else
        this.table.data = [...tableData];

      this.updateFilteredTable("searchCustomerName");
    },
    searchTotalAmount: function () {
      if(this.searchTotalAmount != '') {
        this.table.data = [...tableData].filter(item => 
          item.Total_Amount.toString().includes(this.searchTotalAmount));
      }
      else
        this.table.data = [...tableData];

      this.updateFilteredTable("searchTotalAmount");
    },
    searchPaidAmount: function () {
      if(this.searchPaidAmount != '') {
        this.table.data = [...tableData].filter(item => 
          item.Paid_Amount.toString().includes(this.searchPaidAmount));
      }
      else
        this.table.data = [...tableData];

      this.updateFilteredTable("searchPaidAmount");
    },
    searchBalance: function () {
      if(this.searchBalance != '') {
        this.table.data = [...tableData].filter(item => 
          this.computeBalance(item.Total_Amount,item.Paid_Amount).toString().includes(this.searchBalance));
      }
      else
        this.table.data = [...tableData];

      this.updateFilteredTable("searchBalance");
    },
    searchOrderedDate: function () {
      if(this.searchOrderedDate != '') {
        this.table.data = [...tableData].filter(item => 
          item.Created_Date.toUpperCase().includes(this.searchOrderedDate.toUpperCase()));
      }
      else
        this.table.data = [...tableData];

      this.updateFilteredTable("searchOrderedDate");
    },
    searchOrderedFrom: function () {
      if(this.searchOrderedFrom != '') {
        this.table.data = [...tableData].filter(item => 
          item.Created_By.toUpperCase().includes(this.searchOrderedFrom.toUpperCase()));
      }
      else
        this.table.data = [...tableData];

      this.updateFilteredTable("searchOrderedFrom");
    }
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
    tableColumns() {
      return this.$t('sales.tableColumns');
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
        return this.computeBalance(item["totalAmount"], item["paidAmount"]);

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
    updateFilteredTable(column) {
      if(this.searchId != '' && column != "searchId"){
        this.table.data = this.table.data.filter(item =>
          item.id.toString().includes(this.searchId));
      }

      if(this.searchCustomerName != '' && column != "searchCustomerName"){
        this.table.data = this.table.data.filter(item =>
          item.Customer_Name.toUpperCase().includes(this.searchCustomerName.toUpperCase()));
      }

      if(this.searchTotalAmount != '' && column != "searchTotalAmount"){
        this.table.data = this.table.data.filter(item =>
          item.Total_Amount.toString().includes(this.searchTotalAmount));
      }

      if(this.searchPaidAmount != ''&& column != "searchPaidAmount"){
        this.table.data = this.table.data.filter(item =>
          item.Paid_Amount.toString().includes(this.searchPaidAmount));
      }

      if(this.searchBalance != '' && column != "searchBalance"){
        this.table.data = this.table.data.filter(item =>
          this.computeBalance(item.Total_Amount,item.Paid_Amount).toString().includes(this.searchBalance));
      }

      if(this.searchOrderedDate != '' && column != "searchOrderedDate"){
        this.table.data = this.table.data.filter(item =>
          item.Created_Date.toUpperCase().includes(this.searchOrderedDate.toUpperCase()));
      }

      if(this.searchOrderedFrom != '' && column != "searchOrderedFrom"){
        this.table.data = this.table.data.filter(item =>
          item.Created_By.toUpperCase().includes(this.searchOrderedFrom.toUpperCase()));
      }
    }
  }
};
</script>
<style>
</style>
