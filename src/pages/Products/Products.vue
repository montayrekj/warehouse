<template>
    <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
      <div class="col-12">
        <card>
          <h4>Advanced Search</h4>
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
              <input type="text" class="form-control"  placeholder="Enter supplier name..." v-model="searchSupplier" >
            </div>
          </div>
          <div class="row" style="margin-top: 20px">
            <div class="col-md-10"></div>
            <div class="col-md-2">
              <button class="btn btn-success" style="width: 100%">Search</button>
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
      <sweet-modal ref="deleteWarning" icon="warning" hide-close-button overlay-theme="dark" modal-theme="dark">
        Are you sure you want to delete <span>{{toBeDeletedName}}</span>?
        <button slot="button" v-on:click="deleteProduct()" class="btn btn-sm btn-success" style="margin-right: 5px">Yes</button>
        <button slot="button" v-on:click="deleteWarn(0)" class="btn btn-sm btn-danger">No</button>
      </sweet-modal>
    </div>
</template>
<script>

  import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
  const tableColumns = ["Name", "Code", "Quantity", "Unit",  "Price", "Supplier", "Limit"];
  const entityColumns = ["productName", "productCode", "quantity", "unit",  "price", "supplier", "quantityLimit"];

  export default {
    components: {
      SweetModal,
      SweetModalTab,
    },
    data() {
      return {
        table: {
          data: this.products
        },
        modalFlag: false,
        type: '',
        tbodyClasses: '',
        toBeDeleted: 0,
        searchProductName: '',
        searchProductCode: '',
        searchUnit: '',
        searchSupplier: ''
      };
    },
    props: {
      sample: Boolean,
      products: Array,
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
      }
    },
    watch: {
      products() {
        this.table.data = this.products
      }
    },
    methods: {
      hasValue(item, column) {
        return item[column.Item] !== "undefined";
      },
      itemValue(item, column) {
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
      }
    }
  };
</script>
<style>
</style>
