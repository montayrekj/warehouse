<template>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card :style="hide">
          <h4>Advanced Search 
            <i class="advanced-search-icon" :class="searchIcon" @click="hideFlag = !hideFlag"></i>
          </h4>
          <div class="row">
            <div class="form-group col-md-4">
              <label>Product Name</label>
              <input type="text" class="form-control" placeholder="Enter product name..." v-model="searchProductName" >
            </div>
            <div class="form-group col-md-2">
              <label>Product Code</label>
              <input type="text" class="form-control"  placeholder="Enter product code..." v-model="searchProductCode" >
            </div>
            <div class="form-group col-md-2">
              <label>Unit</label>
              <input type="text" class="form-control" placeholder="Enter unit..." v-model="searchUnit" >
            </div>
            <div class="form-group col-md-4">
              <label>Supplier</label>
              <vue-bootstrap-typeahead 
                v-model="supplierName"
                :data="supplierList"
                :minMatchingChars="0"
                placeholder="Enter supplier name..."
                @hit="selectSupplier"/>
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-10"></div>
            <div class="col-md-2">
              <button class="btn btn-success" style="width: 100%" @click="search">Search</button>
            </div>
          </div>
        </card>
        <card>
          <div class="table-responsive">
            <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
              <tr>
                <slot name="columns" style="text-align: center">
                  <th v-for="(column, index) in tableColumns" :key="index">{{column.Header}}</th>
                  <th style="text-align: center;">Actions</th>
                </slot>
              </tr>
              </thead>
              <tbody :class="tbodyClasses">
              <tr v-for="(item, index) in table.data" :key="index">
                <slot :row="item">
                  <td v-for="(column, index) in tableColumns" :key="index" v-if="hasValue(item, column)">
                    <!--a v-bind:href="'/#/products/viewProducts/' + item.productId" v-if="column.Header === 'Id'">{{itemValue(item, column)}}</a>
                    <label v-if="column.Header !== 'Id'">{{itemValue(item, column)}}</label-->
                    {{itemValue(item, column)}}
                  </td>
                  <td style="text-align: center">
                    <i class="tim-icons icon-pencil text-info" 
                      style="font-weight: bold;display: inline-block;width: 20%;text-align: center; cursor:pointer; margin-right: 10px" @click="updateProduct(item.productId)">
                    </i>
                    <i class="tim-icons icon-trash-simple text-danger" 
                      style="font-weight: bold;display: inline-block;width: 20%;text-align: center; cursor:pointer" @click="deleteWarn(index)">
                    </i>
                  </td>
                </slot>
              </tr>
              </tbody>
            </table>
          </div>
        </card>
      </div>

      <!--Delete Warning Modal -->
      <sweet-modal ref="deleteWarning" icon="warning" hide-close-button overlay-theme="dark" modal-theme="dark" :enable-mobile-fullscreen="false">
        Are you sure you want to delete <span>{{toBeDeletedName}}</span>?
        <button slot="button" v-on:click="deleteProduct()" class="btn btn-sm btn-success" style="margin-right: 5px">Yes</button>
        <button slot="button" v-on:click="deleteWarn(0)" class="btn btn-sm btn-danger">No</button>
      </sweet-modal>
    </div>
</template>
<script>

  import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
  import VueBootstrapTypeahead from 'vue-bootstrap-typeahead'
  import axios from 'axios';
  import config from "@/config";

  export default {
    components: {
      SweetModal,
      SweetModalTab,
      VueBootstrapTypeahead
    },
    data() {
      return {
        table: {
          data: this.products
        },
        hideFlag: false,
        modalFlag: false,
        type: '',
        tbodyClasses: '',
        toBeDeleted: 0,
        supplierName: "",
        supplierList: this.suppliers.map(arr => arr.supplierName),
        searchProductName: '',
        searchProductCode: '',
        searchUnit: '',
        searchSupplier: ''
      };
    },
    props: {
      sample: Boolean,
      products: Array,
      suppliers: Array,
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns(){
        return this.$t('products.tableColumns');
      },
      toBeDeletedName() {
        if(this.table.data.length > 0)
          return this.table.data[this.toBeDeleted].name;
      },
      hide() {
        if(this.hideFlag) {
          return "max-height: 55px; overflow: hidden; -webkit-transition: 0.01s; transition: max-height 0.01s ease-in;"
        } else {
          return "max-height: 1000px; -webkit-transition: 0.7s; transition: max-height 0.7s ease-out; "
        }
      },
      searchIcon() {
        if(this.hideFlag) {
          return "tim-icons icon-minimal-right"
        } else {
          return "tim-icons icon-minimal-down"
        }
      }
    },
    watch: {
      supplierName() {
        if(this.supplierName != this.searchSupplier) {
          this.searchSupplier = '';
        }
      },
      products() {
        this.table.data = this.products
      },
      suppliers() {
        this.supplierList = this.suppliers.map(arr => arr.supplierName)
      }
    },
    methods: {
      hasValue(item, column) {
        return item[column.Item] !== "undefined";
      },
      itemValue(item, column) {
        if(column.Item == "quantity" || column.Item == "quantityLimit")
          return item[column.Item].toLocaleString();
        else if(column.Item == "buyPrice" || column.Item == "sellPrice")
          return "PHP " + item[column.Item].toLocaleString();
        else
          return item[column.Item];
      },
      deleteWarn(index) {
        this.$emit("changeSample", !this.sample)
        if(!this.modalFlag) {
          this.$refs.deleteWarning.open();
          this.modalFlag = true;
          this.toBeDeleted = index;
        } else {
          this.$refs.deleteWarning.close();
          this.modalFlag = false;
          this.toBeDeleted = 0;
        }
      },
      deleteProduct() {
        this.$emit("changeSample", !this.sample)
        this.$emit("deleteProduct", this.table.data[this.toBeDeleted].productId)
        this.table.data.splice(this.toBeDeleted, 1)
        this.$refs.deleteWarning.close();
        this.modalFlag = false;
        this.toBeDeleted = 0;
      },
      updateProduct(id) {
        window.location.href = "/#/products/updateProduct/" + id; 
      },
      selectSupplier() {
        this.searchSupplier = this.supplierName;
      },
      search() {
        var baseurl = '/getProducts?'
        var url = "";
        url += "productName=" + this.searchProductName
        url += "&productCode=" + this.searchProductCode
        url += "&unit=" + this.searchUnit
        url += "&supplier=" + this.supplierName
        axios
          .get(config.backend_host + (baseurl + url))
          .then(response => {
            if(response.data.statusCode === "OK"){
              this.table.data = response.data.data;
            }
          })
      }
    }
  };
</script>
<style>
</style>
