<template>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); ">
          <div class="row">
            <div class="form-group col-md-12">
              <label for="supplierName" class="add-customer-label pull-left">Supplier Name</label>
              <input type="text" class="form-control" placeholder="Enter Supplier name..." v-model="supplier.name" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label for="address" class="add-customer-label pull-left">Supplier Address</label>
              <input type="text" class="form-control" placeholder="Enter address..." v-model="supplier.address" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label for="contactNo" class="add-customer-label pull-left">Supplier Contact No.</label>
              <input type="text" class="form-control" placeholder="Enter contact no..." v-model="supplier.contactNo" >
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-9"></div>
            <div class="col-md-3">
              <button class="btn btn-success" style="width: 100%" @click="addSupplier">Add</button>
            </div>
          </div>
        </card>
      </div>
      <!--Success Modal -->
      <sweet-modal ref="successModal" icon="success" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        Successfully added supplier!
      </sweet-modal>
      <!-- Error Modal -->
      <sweet-modal ref="errorModal" icon="error" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        {{errorMessage}}
      </sweet-modal>
    </div>
</template>
<script>

  import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
  import axios from 'axios';
  import config from '@/config';

  export default {
    components: {
      SweetModal,
      SweetModalTab,
    },
    data() {
      return {
        errorMessage: "",
        supplier: {
          name: "",
          address: "",
          contactNo: "",
        }
      };
    },
    methods: {
      addSupplier() {
          var user = JSON.parse(localStorage.getItem("user"))
          var data = new FormData();
          data.append("supplierName", this.supplier.name);
          data.append("supplierAddress", this.supplier.address);
          data.append("supplierContactNo", this.supplier.contactNo);
          data.append("userId", user.userId);

          axios
          .post(config.backend_host + '/addSupplier', data).then(response => {
            if(response.data.statusCode === "OK"){
                this.supplier.name = "";
                this.supplier.address = "";
                this.supplier.contactNo = "";
                this.$refs.successModal.open();
            } else {
              this.errorMessage = response.data.message;
              this.$refs.errorModal.open();
            }
          })
        }
    }
  };
</script>
<style>
</style>
