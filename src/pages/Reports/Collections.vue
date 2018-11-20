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
                        <a href="#" v-if="column.Header === 'Id'">{{itemValue(item, column)}}</a>
                        <label v-if="column.Header !== 'Id'">{{itemValue(item, column)}}</label>
                      </td>
                      <td>
                        <button class="btn btn-success" style="width: 100%;" @click="collect(item.salesLogsId)">Collect</button>
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
  
const tableData = [
  {
    id: 1,
    customer: "Teresita Tala P. Rabago",
    termAmount: 30.00,
    termDueDate: "11/01/2018",
    createdDate: "11/15/2018",
    createdBy: "Admin"
  },
  {
    id: 2,
    customer: "Teresita Tala P. Rabago",
    termAmount: 30.00,
    termDueDate: "11/15/2018",
    createdDate: "11/30/2018",
    createdBy: "Admin"
  },
  {
    id: 3,
    customer: "King Joshua M. Montayre",
    termAmount: 1350.00,
    termDueDate: "11/03/2018",
    createdDate: "11/10/2018",
    createdBy: "Humba"
  }
];

export default {
  data() {
    return {
      table: {
        data: this.collections
      },
      search: '',
      tbodyClasses: '',
      tableColumns: this.$t('collections.tableColumns')
    };
  },
  props: {
    collections: Array
  },
  watch: {
    collections() {
      this.table.data = this.collections;
    },
    search: function () { 
      if(this.search != '') {
        this.table.data = this.collections.filter(item => 
          item.Customer_Name.toUpperCase().includes(this.search.toUpperCase()) ||
          item.Total_Amount.toString().includes(this.search) || 
          item.Paid_Amount.toUpperCase().includes(this.search.toUpperCase()) ||  
          this.computeBalance(item.Total_Amount,item.Paid_Amount).toString().includes(this.search) || 
          item.Created_Date.toUpperCase().includes(this.search.toUpperCase()) ||
          item.Created_By.toUpperCase().includes(this.search.toUpperCase()));
      }
      else
        this.table.data = this.collections;
    }
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
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
    collect(id) {
      this.$emit('collectCollection', id);
    }
  }
};
</script>
<style>
</style>
