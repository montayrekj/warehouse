<template>
  <div class="content">
    <fade-transition :duration="100" mode="out-in">
      <!-- your content here -->
      <router-view 
        :sample="sample" 
        @changeSample="changeSample"
        @addStocks="addStocks"
        :products="products"  
        @deleteProduct="deleteProduct"
        @addProduct="addProduct"
      ></router-view>
    </fade-transition>
  </div>
</template>
<script>
  import {FadeTransition} from 'vue2-transitions';
  import axios from 'axios';
  export default {
    data() {
      return {
        products: []
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
        axios
        .post('http://localhost:8011/addStocks', this.products).then(response => {
          if(response.data.statusCode !== "OK"){
              this.getProducts();
          }
        })
      },
      addProduct(event){
        var data = new FormData();
        data.append('productName', event.productName);
        data.append('productCode', event.productCode);
        data.append('quantity', event.quantity);
        data.append('price', event.price);
        data.append('unit', event.unit);
        data.append('quantityLimit', event.quantityLimit);
        data.append('supplier', event.supplier);

        axios
        .post('http://localhost:8011/addProduct', data).then(response => {
          if(response.data.statusCode !== "OK"){
              this.getProducts();
          }
        })
      },
      deleteProduct(event) {
        var data = new FormData();
        data.append('productId', Number(event));

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
      //Get All Products
       axios
        .post('http://localhost:8011/getProducts')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.products = response.data.data;
        })
    },
  };
</script>
