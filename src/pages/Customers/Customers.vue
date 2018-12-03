<template>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); ">
          <div class="pull-right" style="padding-bottom: 10px; width: 100%">
            <div class="row">
              <div class="col-md-3">
                <input type="text" placeholder="Search" v-model="search" class="form-control" />
              </div>
              <div class="col-md-9"></div>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
              <tr>
                <slot name="columns" style="text-align: center">
                  <th v-for="(column, index) in tableColumns" :key="index">{{column.Header}}</th>
                  <th style="text-align: center;">Actions</th>
                </slot>
              </tr>
              </thead>
              <tbody :class="tbodyClasses">
              <tr v-for="(item, index) in table.data" :key="index">
                <slot :row="item">
                  <td v-for="(column, index) in tableColumns" :key="index" v-if="hasValue(item, column)">
                    {{itemValue(item, column)}}
                  </td>
                  <td style="text-align: center">
                    <i class="tim-icons icon-pencil text-info" 
                      style="font-weight: bold;display: inline-block;width: 20%;text-align: center; cursor:pointer; margin-right: 10px" @click="updateCustomer(item.customerId)">
                    </i>
                  </td>
                </slot>
              </tr>
              </tbody>
            </table>
          </div>
        </card>
      </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        table: {
          data: this.customers
        },
        modalFlag: false,
        type: '',
        tbodyClasses: '',
        search: '',
      };
    },
    props: {
      sample: Boolean,
      customers: Array,
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns(){
        return this.$t('Customers.tableColumns');
      },
    },
    watch: {
      customers() {
        this.table.data = this.customers;
      },
      productCode: function() {
        if(this.productCode !== null)
          this.productCode = this.productCode.toUpperCase();
      },
      search: function () {
        if(this.search != '') {
          this.table.data = this.customers.filter(item => 
            item.customerName.toUpperCase().includes(this.search.toUpperCase()) || 
            item.customerAddress.toUpperCase().includes(this.search.toUpperCase()) || 
            item.customerNumber.toUpperCase().includes(this.search.toUpperCase()))
        }
        else
          this.table.data = this.customers;
      }
    },
    methods: {
      hasValue(item, column) {
        return item[column.Item] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.Item];
      },
      updateCustomer(id) {
        window.location.href = "/#/customers/updateCustomer/" + id; 
      }
    }
  };
</script>
<style>
</style>
