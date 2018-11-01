<template>
    <div class="row">
      <div class="col-12">
        <card>
          <div class="pull-right" style="padding-bottom: 10px">
            <button class="btn btn-sm btn-success" style="margin-right: 5px" @click="toggleAddProduct">Add Product</button>
          </div>
          <div class="table-responsive">
            <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
              <tr>
                <slot name="columns" style="text-align: center">
                  <th v-for="column in table1.columns" :key="column">{{column}}</th>
                  <th style="display: inline-block;width: 100%;text-align: center;">Actions</th>
                </slot>
              </tr>
              </thead>
              <tbody :class="tbodyClasses">
              <tr v-for="(item, index) in table1.data" :key="index">
                <slot :row="item">
                  <td v-for="(column, index) in table1.columns"
                      :key="index"
                      v-if="hasValue(item, column)">
                    {{itemValue(item, column)}}
                  </td>
                  <td style="text-align: center">
                    <i class="tim-icons icon-trash-simple text-danger delete-product" 
                      style="font-weight: bold;display: inline-block;width: 20%;text-align: center; cursor:pointer" @click="deleteWarn(index)">
                    </i>
                  </td>
                </slot>
              </tr>
              </tbody>
            </table>
          </div>
        </card>
      </div>

      <!-- Add Product Modal -->
      <sweet-modal ref="addProductModal" hide-close-button overlay-theme="dark" modal-theme="dark" title="Add Product">
        <div class="form-group">
          <label for="productName">Name</label>
          <input type="text" class="form-control" placeholder="Enter product name..." v-model="productName" >
        </div>
        <div class="form-group">
          <label for="productCode">Code</label>
          <input type="text" class="form-control"  placeholder="Enter product code..." v-model="productCode" >
        </div>
        <div class="form-group">
          <label for="productQuantity">Quantity</label>
          <input type="number" class="form-control" placeholder="0" v-model="productQuantity" >
        </div>
        <div class="form-group">
          <label for="productUnit">Unit</label>
          <input type="text" class="form-control" placeholder="Enter product unit..." v-model="productUnit" >
        </div>
        <div class="form-group">
          <label for="productPrice">Price</label>
          <input type="number" class="form-control" placeholder="0.00" v-model="productPrice" >
        </div>

        <button slot="button" @click="addProduct" class="btn btn-sm btn-success" style="margin-right: 5px">Add</button>
        <button slot="button" v-on:click="toggleAddProduct()" class="btn btn-sm btn-danger">Cancel</button>
      </sweet-modal>

      <!--Delete Warning Modal -->
      <sweet-modal ref="deleteWarning" icon="warning" hide-close-button overlay-theme="dark" modal-theme="dark">
        Are you sure you want to delete <span>{{toBeDeletedName}}</span>?
        <button slot="button" v-on:click="deleteProduct()" class="btn btn-sm btn-success" style="margin-right: 5px">Yes</button>
        <button slot="button" v-on:click="deleteWarn(0)" class="btn btn-sm btn-danger">No</button>
      </sweet-modal>

      <!--Add Product Required Error Modal -->
      <sweet-modal ref="addErrorModal" icon="error" hide-close-button overlay-theme="dark" modal-theme="dark">
        Please input all fields!
        <button slot="button" v-on:click="closeErrorAddProduct()" class="btn btn-sm btn-success" style="margin-right: 5px">Fine!</button>
      </sweet-modal>
    </div>
</template>
<script>
import { BaseTable } from "@/components";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
const tableColumns = ["Name", "Code", "Quantity", "Unit",  "Price"];
const tableData = [
  {
    id: 1,
    name: "Ganador",
    code: "GNDR",
    quantity: "10",
    unit: "Sack",
    price: "54.00"
  },
  {
    id: 2,
    name: "Lion Ivory",
    code: "LNIVRY",
    quantity: "8",
    unit: "Sack",
    price: "50.00"
  },
  {
    id: 3,
    name: "NFA Rice",
    code: "NFA",
    quantity: "25",
    unit: "Kilo",
    price: "30.00"
  },
  {
    id: 4,
    name: "A Plus",
    code: "APLS",
    quantity: "15",
    unit: "Sack",
    price: "84.00"
  },
  {
    id: 5,
    name: "Pilit",
    code: "PLT",
    quantity: "50",
    unit: "Kilo",
    price: "45.00"
  },
  {
    id: 6,
    name: "Sinandomeng",
    code: "SNDMNG",
    quantity: "25",
    unit: "Sack",
    price: "51.00"
  },
  {
    id: 7,
    name: "Jasmine",
    code: "JSMN",
    quantity: "5",
    unit: "Sack",
    price: "58.00"
  }
];

export default {
  components: {
    BaseTable,
    SweetModal,
    SweetModalTab,
  },
  data() {
    return {
      table1: {
        columns: [...tableColumns],
        data: [...tableData]
      },
      modalFlag: false,
      type: '',
      tbodyClasses: '',
      toBeDeleted: 0,
      productName: null,
      productCode: null,
      productQuantity: null,
      productUnit: null,
      productPrice: null,
    };
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
    toBeDeletedName() {
      return this.table1.data[this.toBeDeleted].name;
    }
  },
  watch: {
    productCode: function() {
      if(this.productCode !== null)
        this.productCode = this.productCode.toUpperCase();
    }
  },
  methods: {
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    deleteWarn(index) {
      if(!this.modalFlag) {
        this.$refs.deleteWarning.open();
        this.modalFlag = true;
        this.toBeDeleted = index;
      } else {
        this.$refs.deleteWarning.close();
        this.modalFlag = false;
        this.toBeDeleted = 0;
      }
    },
    deleteProduct() {
      this.table1.data.splice(this.toBeDeleted, 1)
      this.$refs.deleteWarning.close();
      this.modalFlag = false;
      this.toBeDeleted = 0;
    },
    toggleAddProduct(){
      if(!this.modalFlag) {
        this.$refs.addProductModal.open();
        this.modalFlag = true;
      } else {
        this.$refs.addProductModal.close();
        this.modalFlag = false;
      }
    },
    closeErrorAddProduct() {
      this.$refs.addErrorModal.close();
      this.$refs.addProductModal.open();
    },
    addProduct(){
      this.$forceUpdate();
      if(!this.validateProductAdd()){
        this.$refs.addErrorModal.open();
        this.$refs.addProductModal.close();
      } else {
        var price = Number(this.productPrice).toFixed(2);
        var item = {
          id: Number(this.table1.data.length) + 1,
          name: this.productName,
          code: this.productCode,
          quantity: this.productQuantity.toString(),
          unit: this.productUnit,
          price: price.toString()
        }

        this.table1.data.push(item)
        this.$refs.addProductModal.close();
        this.productName = null
        this.productCode =  null;
        this.productQuantity =  null;
        this.productUnit = null;
        this.productPrice = null;
        this.modalFlag = false;
      }
    },
    validateProductAdd(){
      var flag = true;
      if(this.productName === null){
        flag = false;
      } 
      if(this.productCode === null){
        flag = false;
      } 
      if(this.productQuantity === null){
        flag = false;
      } 
      if(this.productUnit === null){
        flag = false;
      } 
      if(this.productPrice === null){
        flag = false;
      }
      return flag;
    }
  }
};
</script>
<style>
</style>
