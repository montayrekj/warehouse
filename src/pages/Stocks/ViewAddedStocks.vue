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
                    <td> <input type="text" placeholder="Search" v-model="searchAddedDate" class="form-control" /> </td>
                    <td> <input type="text" placeholder="Search" v-model="searchAddedBy" class="form-control" /> </td>
                  </tr>
                  <tr v-for="(item, index) in table.data" :key="index">
                    <slot :row="item">
                      <td v-for="(column, index) in tableColumns"
                          :key="index"
                          v-if="hasValue(item, column)" style="text-align: center;">
                        <a v-bind:href="'/#/stocks/viewAddedStocks/' + item.purchasesLogsId" v-if="column.Header === 'Id'">{{itemValue(item, column)}}</a>
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
          data: this.purchases
        },
        searchId: '',
        searchAddedDate: '',
        searchAddedBy: '',
        tbodyClasses: '',
        detailsData: []
      };
    },
    props: {
      purchases: Array,
    },
    watch: {
      purchases: function() {
        this.table.data = this.purchases;
      },
      searchId: function () {
        if(this.searchId != '') {
          this.table.data = this.purchases.filter(item => 
            item.purchasesLogsId.toString().includes(this.searchId));
        }
        else
          this.table.data = this.purchases;

        if(this.searchAddedDate != ''){
          this.table.data = this.table.data.filter(item =>
            item.createdDate.toUpperCase().includes(this.searchAddedDate.toUpperCase()));
        }

        if(this.searchAddedBy != ''){
          this.table.data = this.table.data.filter(item =>
            item.createdBy.toUpperCase().includes(this.searchAddedBy.toUpperCase()));
        }
      },
      searchAddedDate: function () {
        if(this.searchAddedDate != ''){
          this.table.data = this.purchases.filter(item =>
            item.createdDate.toUpperCase().includes(this.searchAddedDate.toUpperCase()));
        }
        else
          this.table.data = this.purchases;

        if(this.searchId != '') {
          this.table.data = this.table.data.filter(item => 
            item.purchasesLogsId.toString().includes(this.searchId));
        }

        if(this.searchAddedBy != ''){
          this.table.data = this.table.data.filter(item =>
            item.createdBy.toUpperCase().includes(this.searchAddedBy.toUpperCase()));
        }
      },
      searchAddedBy: function () {
        if(this.searchAddedBy != ''){
          this.table.data = this.purchases.filter(item =>
            item.createdBy.toUpperCase().includes(this.searchAddedBy.toUpperCase()));
        }
        else
          this.table.data = this.purchases;

        if(this.searchId != '') {
          this.table.data = this.table.data.filter(item => 
            item.purchasesLogsId.toString().includes(this.searchId));
        }

        if(this.searchAddedDate != ''){
          this.table.data = this.table.data.filter(item =>
            item.createdDate.toUpperCase().includes(this.searchAddedDate.toUpperCase()));
        }
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('ViewAddedStocks.tableColumns');
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
        return item[column.Item];
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
      }
    }
  };
</script>
<style>
</style>
