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
          <div class="row" style="margin-top: 20px">
            <div class="col-md-9"></div>
            <div class="col-md-3">
              <button class="btn btn-success" style="width: 100%" @click="updateCustomer">Add</button>
            </div>
          </div>
        </card>
      </div>
      <!--Success Modal -->
      <sweet-modal ref="successModal" icon="success" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        Successfully updated customer!
      </sweet-modal>
      <!--Success Modal -->
      <sweet-modal ref="errorModal" icon="error" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        {{errorMessage}}
      </sweet-modal>
    </div>
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
          contactPerson: "",
          level: "defaultLevel",
        }
      };
    },
    methods: {
      updateCustomer() {
        var formData = new FormData();
        formData.append("customerName", this.customer.name);
        formData.append("customerAddress", this.customer.address);
        formData.append("customerNumber", this.customer.contactNo);
        formData.append("customerContactPerson", this.customer.contactPerson);
        formData.append("customerLevel", this.customer.level);
        formData.append("customerId", this.customer.id)
        formData.append("id", this.$route.params.id)

        axios
            .post(config.backend_host + '/updateCustomer', formData)
            .then(response => {
              if(response.data.statusCode === "OK"){
                this.$refs.successModal.open();
              } else {
                this.errorMessage = response.data.message;
                this.$refs.errorModal.open();
              }
            })
      }
    },
    mounted() {
      var formData = new FormData();
      formData.append("id", this.$route.params.id)
      axios
          .post(config.backend_host + '/getCustomerById', formData)
          .then(response => {
            if(response.data.statusCode === "OK"){
              this.customer.name = response.data.data.customerName;
              this.customer.address = response.data.data.customerAddress;
              this.customer.contactNo = response.data.data.customerNumber;
              this.customer.contactPerson = response.data.data.customerContactPerson;
              this.customer.level = response.data.data.customerLevel
              this.customer.id = response.data.data.customerId;
            }
          })
    }
  };
</script>
<style>
</style>
