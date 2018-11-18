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
      <div>
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
    Products: [
    {productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", buyPrice: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"},
    {productName: "Ganador", productCode: "GNDR", quantity: "10", unit: "Sack", buyPrice: "54.00", supplier: "Bugasan ni Juan", quantityAdded: "3" }],
    Created_Date: "11/01/2018",
    Created_By: "Admin"

  },
  {
    id: 2,
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", buyPrice: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 3,
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", buyPrice: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Created_Date: "11/01/2018",
    Created_By: "Admin"
  },
  {
    id: 4,
    Products: [{ productName: "NFA Rice", productCode: "NFA", quantity: "25", unit: "Kilo", buyPrice: "30.00", supplier: "Bugasan ni Juan", quantityAdded: "3"}],
    Created_Date: "11/01/2018",
    Created_By: "Admin"
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
        detailsData: []
      };
    },
    watch: {
      search: function () {
        if(this.search != '') {
          this.table.data = [...tableData].filter(item => 
            this.itemValue(item, {Item: 'Products'}).toUpperCase().includes(this.search.toUpperCase())||
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
        return this.$t('purchases.tableColumns');
      },
      modalColumns() {
        return this.$t('purchases.modalColumns');
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
        return temp;
      },
      toggleModal(item) {
        this.detailsData = item;
        if(!this.modalFlag) {
          this.modalFlag = true;
          this.$refs.viewDetailsModal.open();
        } else {
          this.modalFlag = false;
          this.$refs.viewDetailsModal.close();
        }
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
