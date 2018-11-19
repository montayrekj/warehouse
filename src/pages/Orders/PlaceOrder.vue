<template>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12" style="max-height: calc(100vh - 88px); overflow: auto">
        <card>
          <div class="row form-group">
            <div class="col-2" style="padding-top: 10px">
              <label class="control-label" style="font-size: 15px">Customer Name </label>
            </div>
            <div class="col-5">
              <vue-bootstrap-typeahead 
                v-model="customerName"
                :data="customers"
                style="border: 0px;"
                :minMatchingChars="0"
                placeholder="Enter product supplier..."
                @hit="selectCustomer"
              />
            </div>
          </div>
          <br>
          <div class="table-responsive">
            <table class="table tablesorter">
              <thead class="text-primary">
              <tr>
                <slot name="columns" >
                  <th v-for="(column, index) in tableColumns" :key="index" v-bind:style="theadStyle(column)">{{column.Header}}</th>
                  <th></th>
                </slot>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(item,indexTemp) in selected" :key="indexTemp">
                  <slot :row="item">
                    <td v-for="(column, index) in tableColumns"
                        :key="index"
                        v-if="hasValue(item, column)" style="text-align: center">
                      <span v-if="column.Header != 'Sell Price'">{{itemValue(item, column)}}</span>
                      <input v-if="column.Header == 'Sell Price'" 
                        type="number" 
                        class="form-control" 
                        id="stockQuantity" 
                        style="background-color: #1c2a38"
                        min="0"
                        v-model="item.sellPrice">
                      <input v-if="quantityChangeColumn(column)" 
                        type="number" 
                        class="form-control" 
                        id="stockQuantity" 
                        style="background-color: #1c2a38"
                        min="0"
                        @change="quantityChange($event, item.productId, indexTemp)"
                        v-model="quantity[indexTemp]">
                    </td>
                    <td>
                      <i class="tim-icons icon-simple-remove" style="color: #f94b4b; font-weight: bold" @click="removeSelected(indexTemp)"></i>
                    </td>
                  </slot>
                </tr>
                <tr>
                  <td>
                    <select @change="onChange($event.target.value)" class="form-control" v-model="selectValue" style="min-width: 130px">
                      <option value="0" disabled selected>Select Product</option>
                      <option v-for="(item) in table.data" :key="item.productId" :value="item.productId">{{item.productName}}</option>
                    </select>
                  </td>
                  <td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              </tbody>
              <tfoot class="text-primary">
                <tr>
                  <td></td><td></td><td></td><td></td>
                  <td style="text-align:center; font-weight:bold; padding-top: 40px">TOTAL AMOUNT</td>
                  <td style="text-align:center; font-weight:bold; padding-top: 40px">{{totalAmount}}</td>
                  <td></td>
                  <td style="padding-top: 40px"><button class="btn btn-success" style="width: 100%;" @click="save()">Place Order</button></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </card>
      </div>
    </div>
</template>
<script>
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
export default {
  components: {
    VueBootstrapTypeahead
  },
  data() {
    return {
      table: {
        data: this.products,
      },
      selected: [],
      quantity: [],
      selectValue: 0,
      totalAmount: 0,
      customerName: "",
      customerSelected: "",
    }
  },
  props: {
    products: Array,
    customers: Array,
  },
  watch: {
    products() {
      this.table.data = this.products.filter(product => product.quantity !== 0);
    },
    selected() {
      this.table.data = this.products.filter(product => product.quantity !== 0);
      for(var i = 0; i < this.selected.length; i++){
        this.table.data = this.table.data.filter(product => product.productId !== this.selected[i].productId);
      }
    }
  },
  computed: {
    tableColumns() {
      return this.$t('PlaceOrder.tableColumns');
    }
  },
  methods: {
    theadStyle(column) {
      if(column.Header == "Sell Price" || column.Header == 'Quantity Sold')
        return "text-align: center; width: 100px"
      else 
        return "text-align: center;"
    },
    hasValue(item, column) {
      return item[column.Item] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.Item];
    },
    quantityChangeColumn(column){
      return column.Header === "Quantity Sold";
    },
    quantityChange(event, id, index){
      event.preventDefault();
      var val = Number(event.target.value);
      var item = this.getItemById(id);
      if(val < 0){
        this.quantity[index] = 0;
      }
      this.computeTotalAmount();
      this.$forceUpdate();
    },
    getItemById(id){
      for(var i = 0; i < this.table.data.length; i++){
        if(this.table.data[i].productId === id){
          return this.table.data[i];
        }
      }
    },
    onChange($event) {
      var product = this.products.filter(product => product.productId.toString() === $event)[0]
      this.selected.push(product);
      this.selectValue = 0;
      this.quantity.push(0)
    },
    removeSelected(index){
      this.selected.splice(index, 1)
      this.quantity.splice(index, 1)
      this.computeTotalAmount();
    },
    save() {
      for(var i = 0; i < this.selected.length; i++) {
        this.selected[i].quantity = Number(this.quantity[i]);
      }
      this.$emit("removeStocks", this.selected, this.customerSelected)
    },
    computeTotalAmount() {
      this.totalAmount = 0;
      for(var i=0; i < this.selected.length; i++) {
        this.totalAmount += (this.selected[i].sellPrice * this.quantity[i]);
      }
    },
    selectCustomer() {
      this.customerSelected = this.customerName;
    }
  }
};
</script>
<style>
</style>
