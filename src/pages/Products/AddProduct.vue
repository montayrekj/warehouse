<template>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); overflow: auto">
          <div class="form-group">
            <label for="productName">Product Name</label>
            <input type="text" class="form-control" placeholder="Enter product name..." v-model="productName" >
          </div>
          <div class="row">
            
            <div class="form-group col-md-6">
              <label for="productCode">Product Code</label>
              <input type="text" class="form-control"  placeholder="Enter product code..." v-model="productCode" >
            </div>
            <div class="form-group col-md-6">
              <label for="productLimit">Quantity Limit</label>
              <input type="number" class="form-control" placeholder="0" v-model="productLimit" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-6">
              <label for="productQuantity">Quantity</label>
              <input type="number" class="form-control" placeholder="0" v-model="productQuantity" >
            </div>
            <div class="form-group col-md-6">
              <label for="productUnit">Unit</label>
              <input type="text" class="form-control" placeholder="Enter product unit..." v-model="productUnit" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label for="supplier">Supplier</label>
              <vue-bootstrap-typeahead 
                v-model="productSupplier"
                :data="suppliers"
                style="border: 0px;"
                :minMatchingChars="0"
                placeholder="Enter product supplier..."
                @hit="selectSupplier"
              />
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-6">
              <label for="productBuyPrice">Buy Price</label>
              <input type="number" class="form-control" placeholder="0.00" v-model="productBuyPrice" >
            </div>
            <div class="form-group col-md-6">
              <label for="productSellPrice">Sell Price</label>
              <input type="number" class="form-control" placeholder="0.00" v-model="productSellPrice" >
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-9"></div>
            <div class="col-md-3">
              <button class="btn btn-success" style="width: 100%" @click="addProduct">Add</button>
            </div>
          </div>
        </card>
      </div>
      <!--Add Product Required Error Modal -->
      <sweet-modal ref="addErrorModal" icon="error" overlay-theme="dark" modal-theme="dark">
        {{this.errorMessage}}
      </sweet-modal>
    </div>
</template>
<script>
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
export default {
  components: {
    SweetModal,
    SweetModalTab,
    VueBootstrapTypeahead
  },
  props: {
    suppliers: Array,
  },
  data() {
    return {
      toBeDeleted: 0,
      productName: null,
      productCode: null,
      productQuantity: null,
      productUnit: null,
      productBuyPrice: null,
      productSellPrice: null,
      productSupplier: null,
      productLimit: null,
      supplier: "",
      supplierSelected: "",
      errorMessage: "",
    };
  },
  computed: {
    toBeDeletedName() {
      if(this.table.data.length > 0)
        return this.table.data[this.toBeDeleted].name;
    }
  },
  watch: {
    products() {
      this.table.data = this.products
    },
    productCode: function() {
      if(this.productCode !== null)
        this.productCode = this.productCode.toUpperCase();
    },
  },
  methods: {
    addProduct(){
      if(this.validateProductAdd()){ 
        var buyprice = Number(this.productBuyPrice).toFixed(2);
        var sellprice = Number(this.productSellPrice).toFixed(2);
        var item = {
          productName: this.productName,
          productCode: this.productCode,
          quantity: this.productQuantity.toString(),
          unit: this.productUnit,
          buyPrice: buyprice.toString(),
          sellPrice: sellprice.toString(),
          supplier: this.productSupplier,
          quantityLimit: this.productLimit.toString()
        }
        this.$emit("addProduct", item);
        this.productName = null
        this.productCode =  null;
        this.productQuantity =  null;
        this.productUnit = null;
        this.productBuyPrice = null;
        this.productSellPrice = null;
        this.productLimit = null;
        this.productSupplier = null;
      } else {
        this.$refs.addErrorModal.open();
      }
    },
    validateProductAdd(){
      var flag = true;
      this.errorMessage = "Please input all fields!"
      if(this.productName === null || this.productName === ""){
        flag = false;
      } 
      if(this.productCode === null || this.productCode === ""){
        flag = false;
      } 
      if(this.productQuantity === null || this.productQuantity === ""){
        flag = false;
      } 
      if(this.productUnit === null || this.productUnit === ""){
        flag = false;
      } 
      if(this.productBuyPrice === null || this.productBuyPrice === ""){
        flag = false;
      }
      if(this.productSellPrice === null || this.productSellPrice === ""){
        flag = false;
      }
      if(this.productLimit === null || this.productLimit === ""){
        flag = false;
      }
      if((this.productSupplier === null || this.productName === "") || this.supplierSelected !== this.productSupplier){
        if(this.productSupplier === null || this.productSupplier === "") {
          this.errorMessage = "Please input all fields!"
        } else {
          this.errorMessage = "Supplier doesn't exist!"
        }
        flag = false;
      }
      return flag;
    },
    selectSupplier() {
      this.supplierSelected = this.productSupplier;
    }
  }
};
</script>
<style>
</style>
