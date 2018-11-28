<template>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); overflow: auto">
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
              <label for="contactNo" class="add-customer-label pull-left">Customer Contact No.</label>
              <input type="text" class="form-control" placeholder="Enter contact no..." v-model="customer.contactNo" >
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-9"></div>
            <div class="col-md-3">
              <button class="btn btn-success" style="width: 100%" @click="addCustomer">Add</button>
            </div>
          </div>
        </card>
      </div>
      <!--Success Modal -->
      <sweet-modal ref="successModal" icon="success" overlay-theme="dark" modal-theme="dark">
        Successfully added customer!
      </sweet-modal>
    </div>
</template>
<script>
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
import axios from 'axios';
import config from '@/config';

export default {
  components: {
    SweetModal,
    SweetModalTab,
    VueBootstrapTypeahead
  },
  data() {
    return {
      errorMessage: "",
      customer: {
        name: "",
        address: "",
        contactNo: "",
      }
    };
  },
  methods: {
    addCustomer() {
        var user = JSON.parse(localStorage.getItem("user"))
        var data = new FormData();
        data.append("customerName", this.customer.name);
        data.append("customerAddress", this.customer.address);
        data.append("customerContactNo", this.customer.contactNo);
        data.append("userId", user.userId);

        axios
        .post(config.backend_host + '/addCustomer', data).then(response => {
          if(response.data.statusCode === "OK"){
              this.$refs.successModal.open();
          }
        })
      }
  }
};
</script>
<style>
</style>
