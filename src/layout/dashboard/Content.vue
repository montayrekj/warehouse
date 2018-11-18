<template>
  <div class="content">
    <fade-transition :duration="100" mode="out-in">
      <!-- your content here -->
      <router-view 
        :sample="sample" 
        @changeSample="changeSample"
        @addStocks="addStocks"
        @removeStocks="removeStocks"
        :products="products"  
        :purchases="purchases"
        :sales="sales"
        :suppliers="suppliers"
        @deleteProduct="deleteProduct"
        @addProduct="addProduct"
        @updateProduct="updateProduct"
      ></router-view>
    </fade-transition>
  </div>
</template>
<script>
  import {FadeTransition} from 'vue2-transitions';
  import axios from 'axios';
  import moment from 'moment';
  export default {
    data() {
      return {
        products: [],
        purchases: [],
        sales: [],
        suppliers: [],
        userId: null,
      }
    },
    props: {
      sample: Boolean
    },
    components: {
      FadeTransition
    }, 
    methods: {
      //Start of props events
      changeSample(event) {
        this.$emit("changeSample2", event)
      },
      addStocks(event) {
        event[0].modifiedBy = this.userId;
        axios
        .post('http://localhost:8011/addStocks', event).then(response => {
          if(response.data.statusCode === "OK"){
              this.getProducts();
              window.location.href = "/#/products/viewProducts"
          }
        })
      },
      removeStocks(event) {
        event[0].modifiedBy = this.userId;
        axios
        .post('http://localhost:8011/removeStocks', event).then(response => {
          if(response.data.statusCode === "OK"){
              this.getProducts();
              window.location.href = "/#/products/viewProducts"
          }
        })
      },
      addProduct(event){
        var data = new FormData();
        data.append('productName', event.productName);
        data.append('productCode', event.productCode);
        data.append('quantity', event.quantity);
        data.append('buyPrice', event.buyPrice);
        data.append('sellPrice', event.sellPrice);
        data.append('unit', event.unit);
        data.append('quantityLimit', event.quantityLimit);
        data.append('supplier', event.supplier);
        data.append('createdBy', Number(this.userId))

        axios
        .post('http://localhost:8011/addProduct', data).then(response => {
          if(response.data.statusCode === "OK"){
              this.getProducts();
              window.location.href = "/#/products/viewProducts"
          }
        })
      },
      updateProduct(event){
        var data = new FormData();
        console.log(event)
        data.append('productId', event.productId)
        data.append('productName', event.productName);
        data.append('productCode', event.productCode);
        data.append('quantity', event.quantity);
        data.append('buyPrice', event.buyPrice);
        data.append('sellPrice', event.sellPrice);
        data.append('unit', event.unit);
        data.append('quantityLimit', event.quantityLimit);
        data.append('supplier', event.supplier);
        data.append('createdBy', Number(this.userId))

        axios
        .post('http://localhost:8011/updateProduct', data).then(response => {
          if(response.data.statusCode === "OK"){
              this.getProducts();
              window.location.href = "/#/products/viewProducts"
          }
        })
      },
      deleteProduct(event) {
        var data = new FormData();
        data.append('productId', Number(event));
        data.append('userId', Number(this.userId));

        axios
        .post('http://localhost:8011/deleteProduct', data).then(response => {
          if(response.data.statusCode !== "OK"){
              this.getProducts();
          }
        })
      },
      //End of props events
      getProducts() {
        axios
        .post('http://localhost:8011/getProducts')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.products = response.data.data;
        })
      }
    }, 
    mounted() {
      var user = JSON.parse(localStorage.getItem("user"));
      this.userId = user.userId;

      //Get All Products
       axios
        .post('http://localhost:8011/getProducts')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.products = response.data.data;
        })

        axios
        .post('http://localhost:8011/getPurchasesLogs')
        .then(response => {
          if(response.data.statusCode === "OK")
            for(var i = 0; i < response.data.data.length; i++) {
              response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
            }
            this.purchases = response.data.data;
        })

        axios
        .post('http://localhost:8011/getSalesLogs')
        .then(response => {
          if(response.data.statusCode === "OK")
            for(var i = 0; i < response.data.data.length; i++) {
              response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
            }
            this.sales = response.data.data;
        })

        axios
        .post('http://localhost:8011/getSuppliers')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.suppliers = response.data.data.map(arr => arr.supplierName);
        })
    },
  };
</script>
