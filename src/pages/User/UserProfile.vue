<template>
    <div class="row" style="max-height: calc(100vh - 88px);  overflow: auto">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px);">
          <div class="row">
            <div class="form-group col-md-12">
              <label for="username">Username</label>
              <input type="text" class="form-control" v-model="username" disabled>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label for="password">Password</label>
              <div class="input-group">
                <input :type="passwordType" class="form-control" placeholder="Enter password..." v-model="password" >
                <div class="input-group-append eye-password" @click="showPassword">
                  <i :class="iconClass"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label for="email">Email Address</label>
              <input type="email" class="form-control" placeholder="Enter email address..." v-model="email" >
            </div>
          </div>
          <div class="row">
            <div class="form-group col-md-12">
              <label for="nickname">Nickname</label>
              <input type="text" class="form-control" placeholder="Enter nickname..." v-model="nickname" >
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-9"></div>
            <div class="col-md-3">
              <button class="btn btn-success" style="width: 100%" @click="save">Save Profile</button>
            </div>
          </div>
        </card>
      </div>
      <!--Success Modal -->
      <sweet-modal ref="successModal" icon="success" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        Successfully updated user profile!
      </sweet-modal>
      <!--Error Modal -->
      <sweet-modal ref="errorModal" icon="error" overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        {{this.responseMessage}}
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
    props: {
      suppliers: Array,
    },
    data() {
      return {
        user: null,
        username: "",
        password: "",
        email: "",
        nickname: "",
        responseMessage: "",
        showPasswordFlag: false,
      };
    },
    computed: {
      iconClass() {
        return this.showPasswordFlag? "fa fa-eye-slash" : "fa fa-eye"
      },
      passwordType() {
        return this.showPasswordFlag? "text" : "password"
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
      save() {
        this.user.password = this.password;
        this.user.email = this.email;
        this.user.nickname = this.nickname;

        axios
        .post(config.backend_host + '/updateUser', this.user)
        .then(response => {
          if(response.data.statusCode === "OK"){
            this.responseMessage = "Successfully updated user profile!"
            this.$refs.successModal.open();
            localStorage.setItem("user", JSON.stringify(this.user));
          }
        })

      },
      showPassword() {
        this.showPasswordFlag = !this.showPasswordFlag;
      }
    },
    mounted() {
      var temp = JSON.parse(localStorage.getItem("user"));
      this.user = temp;
      this.username = this.user.username;
      this.password = this.user.password;
      this.email = this.user.email;
      this.nickname = this.user.nickname;
    }
  };
</script>
<style>
</style>
