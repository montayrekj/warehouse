<template>
  <div class="content">
    <fade-transition :duration="100" mode="out-in">
      <!-- your content here -->
      <router-view 
        :sample="sample" 
        :products="products"  
        :purchases="purchases"
        :orders="orders"
        :suppliers="suppliers"
        :customers="customers"
        :collections="collections"
        :stocks="stocks"
        :sales="sales"
        @deleteProduct="deleteProduct"
        @addProduct="addProduct"
        @updateProduct="updateProduct"
        @changeSample="changeSample"
        @addStocks="addStocks"
        @removeStocks="removeStocks"
        @addCustomer="addCustomer"
        @addSupplier="addSupplier"
        @regionalManagerApproved="regionalManagerApproved"
        @accountingApproved="accountingApproved"
        @collectCollection="collectCollection"
        @checkerConfirmOrder="checkerConfirmOrder"
      ></router-view>
    </fade-transition>
  </div>
</template>
<script>
  import {FadeTransition} from 'vue2-transitions';
  import axios from 'axios';
  import moment from 'moment';
  import config from '@/config'
  export default {
    data() {
      return {
        products: [],
        purchases: [],
        orders: [],
        suppliers: [],
        customers: [],
        collections: [],
        sales: [],
        stocks:[],
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
        .post(config.backend_host + '/addStocks', event).then(response => {
          if(response.data.statusCode === "OK"){
              this.getProducts();
              window.location.href = "/#/stocks/viewAddedStocks"
          }
        })
      },
      removeStocks(event, customerName) {
        event[0].modifiedBy = this.userId;
        customerName = "/" + customerName
        axios
        .post(config.backend_host +'/removeStocks' + customerName, event).then(response => {
          if(response.data.statusCode === "OK"){
              this.getProducts();
              window.location.href = "/#/orders/viewActiveOrders"
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
        .post(config.backend_host + '/addProduct', data).then(response => {
          if(response.data.statusCode === "OK"){
              this.getProducts();
              window.location.href = "/#/products/viewProducts"
          }
        })
      },
      addCustomer(event) {
        var data = new FormData();
        data.append("customerName", event.name);
        data.append("customerAddress", event.address);
        data.append("customerContactNo", event.contactNo);
        data.append("userId", this.userId);

        axios
        .post(config.backend_host + '/addCustomer', data).then(response => {
          if(response.data.statusCode === "OK"){
              this.getCustomers();
          }
        })
      },
      addSupplier(event) {
        var data = new FormData();
        data.append("supplierName", event.name);
        data.append("supplierAddress", event.address);
        data.append("supplierContactNo", event.contactNo);
        data.append("userId", this.userId);

        axios
        .post(config.backend_host + '/addSupplier', data).then(response => {
          if(response.data.statusCode === "OK"){
              this.getSuppliers();
          }
        })
      },
      updateProduct(event){
        var data = new FormData();
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
        .post(config.backend_host + '/updateProduct', data).then(response => {
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
        .post(config.backend_host + '/deleteProduct', data).then(response => {
          if(response.data.statusCode !== "OK"){
              this.getProducts();
          }
        })
      },
      regionalManagerApproved(event){
        var data = new FormData();
        data.append('orderId', event.orderId);
        data.append('approved', event.approved);
        window.location.href="/#/orders/viewActiveOrders"
        axios
        .post(config.backend_host + '/regionalManagerApproved', data).then(response => {
         
          if(response.data.statusCode === "OK"){
          }
        })
      },
      accountingApproved(event){
        var data = new FormData();
        data.append('orderId', event.orderId);
        data.append('approved', event.approved);
        data.append('cashAmount', event.cashAmount);
        data.append('termAmount', event.termAmount);
        data.append('termDueDate', event.termDueDate);
        data.append('userId', this.userId);
        window.location.href="/#/orders/viewActiveOrders"
        axios
        .post(config.backend_host + '/accountingApproved', data).then(response => {
          
          if(response.data.statusCode === "OK"){
              
          }
        })
      },
      checkerConfirmOrder(event) {
        axios
        .post(config.backend_host + '/checkerConfirmOrder', event).then(response => {
          if(response.data.statusCode === "OK"){
              //window.location.href="/#/orders/viewActiveOrders"
          }
        })
      },
      collectCollection(event) {
        var data = new FormData();
        data.append('orderId', event);
        data.append('userId', this.userId);

        axios
        .post(config.backend_host + '/collect', data).then(response => {
          if(response.data.statusCode === "OK"){
              window.location.reload();
          }
        })
      },
      //End of props events
      getProducts() {
        axios
        .post(config.backend_host + '/getProducts')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.products = response.data.data;
        })
      },
      getCustomers() {
        axios
        .post(config.backend_host + '/getCustomers')
        .then(response => {
          if(response.data.statusCode === "OK")
            //this.customers = response.data.data.map(arr => arr.customerName);
            this.customers = response.data.data;
        })
      },
      getSuppliers() {
        axios
        .post(config.backend_host + '/getSuppliers')
        .then(response => {
          if(response.data.statusCode === "OK")
            //this.suppliers = response.data.data.map(arr => arr.supplierName);
            this.suppliers = response.data.data;
        })
      }
    }, 
    mounted() {
      var user = JSON.parse(localStorage.getItem("user"));
      this.userId = user.userId;

      //Get All Products
       axios
        .post(config.backend_host + '/getProducts')
        .then(response => {
          if(response.data.statusCode === "OK")
            this.products = response.data.data;
        })

        axios
        .post(config.backend_host + '/getPurchasesLogs')
        .then(response => {
          if(response.data.statusCode === "OK"){
            for(var i = 0; i < response.data.data.length; i++) {
              response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
            }
            this.purchases = response.data.data;
          }
        })

        axios
        .post(config.backend_host + '/getOrders')
        .then(response => {
          if(response.data.statusCode === "OK"){
            for(var i = 0; i < response.data.data.length; i++) {
              response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
            }
            this.orders = response.data.data;
          }
        })

        this.getSuppliers();

        this.getCustomers();

        axios
        .post(config.backend_host + '/getCollections')
        .then(response => {
          if(response.data.statusCode === "OK"){
            for(var i = 0; i < response.data.data.length; i++) {
              response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
              response.data.data[i].termDueDate = moment(response.data.data[i].termDueDate).format("MM/DD/YYYY");
            }
            this.collections = response.data.data;
          }
        })

        axios
        .post(config.backend_host + '/getSales')
        .then(response => {
          if(response.data.statusCode === "OK"){
            for(var i = 0; i < response.data.data.length; i++) {
              response.data.data[i].createdDate = moment(response.data.data[i].createdDate).format("MM/DD/YYYY");
              response.data.data[i].termDueDate = moment(response.data.data[i].termDueDate).format("MM/DD/YYYY");
            }
            this.sales = response.data.data;
          }
        })

        axios
        .post(config.backend_host + '/getStocks')
        .then(response => {
          if(response.data.statusCode === "OK"){
            this.stocks = response.data.data;
          }
        })
    },
  };
</script>
