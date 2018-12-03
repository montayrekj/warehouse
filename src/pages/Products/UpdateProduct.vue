<template>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); ">
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
              <label for="productQuantity">Quantity (Edit in Add Stocks)</label>
              <input type="number" class="form-control" placeholder="0" v-model="productQuantity" disabled>
            </div>
            <div class="form-group col-md-6">
              <label for="productUnit">Unit</label>
              <input type="text" class="form-control" placeholder="Enter product unit..." v-model="productUnit" >
            </div>
          </div>
          <div class="form-group">
            <label for="productSupplier">Supplier</label>
            <input type="text" v-if="onloadSupplier === true" class="form-control" placeholder="Enter product supplier..." v-model="productSupplier" >
            <vue-bootstrap-typeahead 
                v-model="productSupplier"
                v-if="onloadSupplier === false"
                :data="suppliers"
                style="border: 0px;"
                :minMatchingChars="0"
                placeholder="Enter product supplier..."
                @hit="selectSupplier"
              />
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
              <button class="btn btn-success" style="width: 100%" @click="addProduct">Update</button>
            </div>
          </div>
        </card>
      </div>
      <!--Add Product Required Error Modal -->
      <sweet-modal ref="addErrorModal" icon="error" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        {{errorMessage}}
      </sweet-modal>
    </div>
</template>
<script>

  import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import axios from 'axios';
  import config from '@/config'
  export default {
    components: {
      SweetModal,
      SweetModalTab,
      VueBootstrapTypeahead
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
        productId: null,
        supplier: "",
        supplierSelected: false,
        errorMessage: "",
        onload: false,
        onloadSupplier: false,
      };
    },
    props: {
      suppliers: Array,
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
      productSupplier: function() {
        if(this.onload) {
          this.onload = false;
          this.onloadSupplier = true;
        } else {
          this.onloadSupplier = false;
        }
      }
    },
    methods: {
      addProduct(){
        if(this.validateProductAdd()){ 
          var buyprice = Number(this.productBuyPrice).toFixed(2);
          var sellprice = Number(this.productSellPrice).toFixed(2);
          var item = {
            productId: this.productId,
            productName: this.productName,
            productCode: this.productCode,
            quantity: this.productQuantity.toString(),
            unit: this.productUnit,
            buyPrice: buyprice.toString(),
            sellPrice: sellprice.toString(),
            supplier: this.productSupplier,
            quantityLimit: this.productLimit.toString()
          }
          this.$emit("updateProduct", item);
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
            var temp = this.suppliers.filter(supplier => supplier.supplierName == this.productSupplier)
            if(temp.length == 0)
              this.errorMessage = "Supplier doesn't exist!"
          }
          flag = false;
        }
        return flag;
      },
      selectSupplier(){
        this.supplierSelected = this.productSupplier;
      }
    },
    mounted() {
      var formData = new FormData();
      formData.append("id", this.$route.params.id)
      axios
          .post(config.backend_host + '/getProductById', formData)
          .then(response => {
            if(response.data.statusCode === "OK"){
              this.productId = response.data.data.productId;
              this.productName = response.data.data.productName;
              this.productCode = response.data.data.productCode;
              this.productQuantity = response.data.data.quantity;
              this.productUnit = response.data.data.unit;
              this.productBuyPrice = response.data.data.buyPrice;
              this.productSellPrice = response.data.data.sellPrice;
              this.productSupplier = response.data.data.supplier;
              this.productLimit = response.data.data.quantityLimit;

              this.onload = true;
              this.onloadSupplier = true;
              this.supplierSelected = response.data.data.supplier;
            }
          })
    }
  };
</script>
<style>
</style>
