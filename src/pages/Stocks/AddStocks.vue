<template>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); overflow: auto">
          <div class="table-responsive">
            <table class="table tablesorter">
              <thead class="text-primary">
              <tr style="position: sticky; top: 0;">
                <slot name="columns" >
                  <th v-for="(column, index) in tableColumns" :key="index" style="text-align: center;">{{column.Header}}</th>
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
                      {{itemValue(item, column)}}
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
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dropdown-divider" style="border-top: 1px solid #3d3f52"></div>
          <div class="row">
            <div class="col-xl-9"></div>
            <div class="col-xl-3">
              <button class="btn btn-success" style="width: 100%; margin-top: 15px" @click="save">Add</button>
            </div>  
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
        data: this.products,
      },
      selected: [],
      quantity: [],
      selectValue: 0
    }
  },
  props: {
    products: Array
  },
  watch: {
    products() {
      this.table.data = this.products;
    },
    selected() {
      this.table.data = this.products
      for(var i = 0; i < this.selected.length; i++){
        this.table.data = this.table.data.filter(product => product.productId !== this.selected[i].productId);
      }
      
    }
  },
  computed: {
    tableColumns() {
      return this.$t('AddStocks.tableColumns');
    }
  },
  methods: {
    hasValue(item, column) {
      return item[column.Item] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.Item];
    },
    quantityChangeColumn(column){
      return column.Header === "Quantity Added";
    },
    quantityChange(event, id, index){
      event.preventDefault();
      var val = Number(event.target.value);
      var item = this.getItemById(id);
      if(val < 0){
        this.quantity[index] = 0;
      }
      //this.computeGrandTotal(item);
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
    },
    save() {
      for(var i = 0; i < this.selected.length; i++) {
        this.selected[i].quantity = Number(this.quantity[i]);
      }
      this.$emit("addStocks", this.selected)
    }
  }
};
</script>
<style>
</style>
