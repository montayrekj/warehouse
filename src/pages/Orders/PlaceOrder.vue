<template>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12" style="max-height: calc(100vh - 88px); overflow: auto">
        <card>
          <div class="row form-group">
            <div class="col-md-2" style="padding-top: 10px;">
              <label class="control-label" style="font-size: 15px">Customer Name </label>
            </div>
            <div class="col-md-4">
              <vue-bootstrap-typeahead 
                v-model="customerName"
                :data="customerList"
                style="border: 0px; display: inline-block; width: 85%"
                :minMatchingChars="0"
                placeholder="Enter customer name..."
                @hit="selectCustomer"/>
              <i class="tim-icons icon-simple-add text-success add-customer" @click="addCustomer"></i>
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
                        @focus="setQuantityIndex(indexTemp)"
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
                  <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="dropdown-divider" style="border-top: 1px solid #3d3f52"></div>
          <div class="row">
            <div class="col-xl-6"></div>
            <div class="col-xl-3">
              <label style="text-align:center; font-weight:bold; padding-top: 20px;font-size: 14px;color: #bfbfc5;">TOTAL AMOUNT</label>
              <label style="text-align:center; font-weight:bold; padding-top: 20px;font-size: 14px; color: #bfbfc5; float:right">{{totalAmount.toFixed(2)}}</label>
            </div>
            <div class="col-xl-1"></div>
            <div class="col-xl-2">
              <button class="btn btn-success" style="width: 100%" @click="order()">Place Order</button>
            </div>  
          </div>
        </card>
      </div>
      <sweet-modal ref="addCustomerModal" hide-close-button overlay-theme="dark" modal-theme="dark">
        <div class="row">
          <div class="form-group col-md-12">
            <label for="customerName" class="add-customer-label pull-left">Customer Name</label>
            <input type="text" class="form-control" placeholder="Enter customer name..." v-model="customer.name" >
          </div>
        </div>
        <div class="row">
          <div class="form-group col-md-12">
            <label for="address" class="add-customer-label pull-left">Customer Address</label>
            <input type="text" class="form-control" placeholder="Enter address..." v-model="customer.address" >
          </div>
        </div>
        <div class="row">
          <div class="form-group col-md-12">
            <label for="contactPerson" class="add-customer-label pull-left">Contact Person</label>
            <input type="text" class="form-control" placeholder="Enter contact person..." v-model="customer.contactPerson" >
          </div>
        </div>
        <div class="row">
            <div class="form-group col-md-6">
              <label for="contactNo" class="add-customer-label pull-left">Customer Contact No.</label>
              <input type="text" class="form-control" placeholder="Enter contact no..." v-model="customer.contactNo" >
            </div>
            <div class="form-group col-md-6">
              <label for="contactNo" class="add-customer-label pull-left">Customer Level.</label>
              <select class="form-control" v-model="customer.level">
                <option value="defaultLevel" disabled selected>Select customer level...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <button slot="button" class="btn btn-danger" @click="closeAddCustomerModal" style="margin-right:5px">Cancel</button>
          <button slot="button" class="btn btn-success" @click="save" style="width:130px; margin-left:5px;">Add</button>
      </sweet-modal>
      <sweet-modal ref="errorModal" icon="error" overlay-theme="dark" modal-theme="dark">
        {{this.errorMessage}}
      </sweet-modal>
    </div>
</template>
<script>
  import axios from 'axios';
  import config from '@/config';
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import { SweetModal, SweetModalTab } from 'sweet-modal-vue';

  export default {
    components: {
      VueBootstrapTypeahead,
      SweetModal,
      SweetModalTab
    },
    data() {
      return {
        table: {
          data: this.products,
        },
        customer: {
          name: "",
          address: "",
          contactNo: "",
          contactPerson: "",
          level: "defaultLevel"
        },
        selected: [],
        quantity: [],
        quantityIndex: null,
        selectValue: 0,
        totalAmount: 0.0,
        customerName: "",
        customerSelected: "",
        errorMessage: "",
        customerList: this.customers.map(arr => arr.customerName)
      }
    },
    props: {
      products: Array,
      customers: Array,
    },
    watch: {
      customers() {
        this.customerList = this.customers.map(arr => arr.customerName);
      },
      quantity() {
        if(this.quantityIndex != null) {
          var val = this.quantity[this.quantityIndex]
          var item = this.selected[this.quantityIndex];
          if(val < 0){
            this.quantity[this.quantityIndex] = 0;
          } else if(val > Number(item.quantity)){
            this.quantity[this.quantityIndex] = item.quantity;
          }

          this.computeTotalAmount();
          this.$forceUpdate();
        }
      },
      products() {
        this.table.data = this.products.filter(product => Number(product.quantity) > 0);
      },
      selected() {
        this.table.data = this.products.filter(product => Number(product.quantity) > 0);
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
        if(column.Header == 'Quantity Sold' || column.Header == "Sell Price")
          return "text-align: center; width: 100px; min-width: 100px"
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
      setQuantityIndex(index){
        this.quantityIndex = index;
      },
      quantityChange(event, id, index){
        event.preventDefault();
        var val = Number(event.target.value);
        var item = this.getItemById(id);
        if(val < 0){
          this.quantity[index] = 0;
        } else if(val > Number(item.quantity)){
            this.quantity[index] = item.quantity;
        }

        this.computeTotalAmount();
        this.$forceUpdate();
      },
      getItemById(id){
        for(var i = 0; i < this.products.length; i++){
          if(this.products[i].productId == id){
            return this.products[i];
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
        this.quantityIndex = null;
        this.computeTotalAmount();
      },
      order() {
        if(this.validateOrder()) {
          for(var i = 0; i < this.selected.length; i++) {
            this.selected[i].quantity = Number(this.quantity[i]);
          }
          this.$emit("removeStocks", this.selected, this.customerSelected)
        } else {
          this.$refs.errorModal.open();
        }
      },
      validateOrder() {
        var flag = true;
        if(this.customerSelected == "") {
          if(this.customerName != "") {
            var temp = this.customers.filter(customer => customer.customerName == this.customerName);
            if(temp.length == 0) {
              flag = false;
              this.errorMessage = "Customer doesn't exist!"
              return flag;
            }
          } else {
            flag = false;
            this.errorMessage = "Please input customer!"
            return flag;
          }
        } 
        if(this.selected.length == 0) {
          flag = false;
          this.errorMessage = "Please select product/s!"
          return flag;
        } else {
          for(var i = 0; i < this.quantity.length; i++) {
            if(this.quantity[i] == 0) {
              flag = false;
            this.errorMessage = "Please specify quantity sold!"
            return flag;
            }
          }
        }
        return flag;
      },
      computeTotalAmount() {
        this.totalAmount = 0;
        for(var i=0; i < this.selected.length; i++) {
          this.totalAmount += (this.selected[i].sellPrice * this.quantity[i]);
        }
      },
      selectCustomer() {
        this.customerSelected = this.customerName;
      },
      addCustomer() {
        this.$refs.addCustomerModal.open();
      },
      closeAddCustomerModal() {
        this.$refs.addCustomerModal.close();
      },
      save() {
        //this.$emit("addCustomer", this.customer);
        this.addCustomerBE(this.customer)
        this.$refs.addCustomerModal.close();
      },
      addCustomerBE(item) {
        var data = new FormData();
        data.append("customerName", item.name);
        data.append("customerAddress", item.address);
        data.append("customerContactNo", item.contactNo);
        data.append("customerContactPerson", item.contactPerson);
        data.append("customerLevel", item.level);
        data.append("userId", JSON.parse(localStorage.getItem("user")).userId);

        axios
        .post(config.backend_host + '/addCustomer', data).then(response => {
          if(response.data.statusCode === "OK"){
              axios
              .post(config.backend_host + '/getCustomers')
              .then(response => {
                if(response.data.statusCode === "OK")
                  this.customers = response.data.data.map(arr => arr.customerName);
              })
            } else {
              this.errorMessage = response.data.message;
              this.$refs.errorModal.open();
            }
        })
      },
    }
  };
</script>
<style>
</style>
