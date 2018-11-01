<template>
    <div class="row">
      <div class="col-12">
        <card>
          <div class="pull-right" style="padding-bottom: 10px">
            <button class="btn btn-sm btn-success" style="margin-right: 5px" v-on:click="toggleModal('addStock')">Add Stocks</button>
            <button class="btn btn-sm btn-danger" v-on:click="toggleModal('removeStock')">Reduce Stocks</button>
          </div>
          <div class="table-responsive">
            <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
              <tr>
                <slot name="columns">
                  <th>
                    <div class="form-check">
                    <label class="form-check-label">
                      <input class="form-check-input" type="checkbox" v-model="selectAll" @click="selectAllStocks">
                      <span class="form-check-sign"></span>
                    </label>
                    </div>
                  </th>
                  <th v-for="column in table1.columns" :key="column">{{column}}</th>
                </slot>
              </tr>
              </thead>
              <tbody :class="tbodyClasses">
              <tr v-for="(item, index) in table1.data" :key="index">
                <slot :row="item">
                  <td>
                    <div class="form-check">
                    <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" :value="item.id" v-model="selected">
                      <span class="form-check-sign"></span>
                      </label>
                    </div>
                  </td>
                  <td v-for="(column, index) in table1.columns"
                      :key="index"
                      v-if="hasValue(item, column)">
                    {{itemValue(item, column)}}
                  </td>
                </slot>
              </tr>
              </tbody>
            </table>
          </div>
        </card>
      </div>

      <!-- Error Stocks Modal -->
      <sweet-modal ref="errorStockModal" icon="error" hide-close-button overlay-theme="dark" modal-theme="dark" title="Oops!">
        Please select a Stock inorder to Add/Reduce Stocks.
        <button slot="button" v-on:click="closeErrorModal()" class="btn btn-sm btn-success">Fine!</button>
      </sweet-modal>
      <!-- Add Stocks Modal -->
      <sweet-modal ref="addStockModal" hide-close-button overlay-theme="dark" modal-theme="dark" title="Add Stocks">
        <table class="table tablesorter" :class="tableClass">
          <thead class="text-primary">
          <tr>
            <slot name="columns">
              <th v-for="column in table1.modalColumns" :key="column" :width="getWidth(column)">{{column}}</th>
            </slot>
          </tr>
          </thead>
          <tbody :class="tbodyClasses">
          <tr v-for="(i, indexTemp) in selected" :key="indexTemp">
            <slot :row="i">
              <td v-for="(column, index) in table1.modalColumns"
                  :key="index"
                  v-if="hasValue(getItemById(i), column)">
                {{itemValue(getItemById(i), column)}}
                <input v-if="quantityChangeColumn(column)" 
                  type="number" 
                  class="form-control" 
                  id="stockQuantity" 
                  style="background-color: #1c2a38"
                  min="0"
                  @change="quantityChange($event, i, indexTemp, 'addStock')"
                  v-model="quantity[indexTemp]">
              </td>
            </slot>
          </tr>
          </tbody>
        </table>

        <button slot="button" v-on:click="saveStock('addStock')" class="btn btn-sm btn-success" style="margin-right: 5px">Save</button>
        <button slot="button" v-on:click="toggleModal('addStock')" class="btn btn-sm btn-danger">Cancel</button>
      </sweet-modal>

      <!-- Remove Stocks Modal -->
      <sweet-modal ref="removeStockModal" hide-close-button overlay-theme="dark" modal-theme="dark" title="Reduce Stocks">
        <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
              <tr>
                <slot name="columns">
                  <th v-for="column in table1.modalColumns" :key="column" :width="getWidth(column)">{{column}}</th>
                </slot>
              </tr>
              </thead>
              <tbody :class="tbodyClasses">
              <tr v-for="(i, indexTemp) in selected" :key="indexTemp">
                <slot :row="i">
                  <td v-for="(column, index) in table1.modalColumns"
                      :key="index"
                      v-if="hasValue(getItemById(i), column)">
                    {{itemValue(getItemById(i), column)}}
                    <input v-if="quantityChangeColumn(column)" 
                      type="number" 
                      class="form-control" 
                      id="stockQuantity" 
                      style="background-color: #1c2a38"
                      min="0"
                      @change="quantityChange($event, i, indexTemp, 'removeStock')"
                      v-model="quantity[indexTemp]">
                  </td>
                </slot>
              </tr>
              </tbody>
            </table>
        <button slot="button" v-on:click="saveStock('removeStock')" class="btn btn-sm btn-success" style="margin-right: 5px">Save</button>
        <button slot="button" v-on:click="toggleModal('removeStock')" class="btn btn-sm btn-danger">Cancel</button>
      </sweet-modal>
    </div>
</template>
<script>
import { BaseTable } from "@/components";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
const tableColumns = ["Name", "Code", "Quantity", "Unit",  "Price"];
const modalColumns = ["Name", "Quantity", "Unit", ""]
const tableData = [
  {
    id: 1,
    name: "Ganador",
    code: "GNDR",
    quantity: "10",
    unit: "Sack",
    price: "54.00"
  },
  {
    id: 2,
    name: "Lion Ivory",
    code: "LNIVRY",
    quantity: "8",
    unit: "Sack",
    price: "50.00"
  },
  {
    id: 3,
    name: "NFA Rice",
    code: "NFA",
    quantity: "25",
    unit: "Kilo",
    price: "30.00"
  },
  {
    id: 4,
    name: "A Plus",
    code: "APLS",
    quantity: "15",
    unit: "Sack",
    price: "84.00"
  },
  {
    id: 5,
    name: "Pilit",
    code: "PLT",
    quantity: "50",
    unit: "Kilo",
    price: "45.00"
  },
  {
    id: 6,
    name: "Sinandomeng",
    code: "SNDMNG",
    quantity: "25",
    unit: "Sack",
    price: "51.00"
  },
  {
    id: 7,
    name: "Jasmine",
    code: "JSMN",
    quantity: "5",
    unit: "Sack",
    price: "58.00"
  }
];

export default {
  components: {
    BaseTable,
    SweetModal,
    SweetModalTab,
  },
  data() {
    return {
      table1: {
        columns: [...tableColumns],
        data: [...tableData],
        modalColumns: [...modalColumns]
      },
      modalFlag: false,
      selected: [],
      selectAll: false,
      type: '',
      tbodyClasses: '',
      quantity: [],
    };
  },
  computed: {
    tableClass() {
      return this.type && `table-${this.type}`;
    },
  },
  watch: {
    selected: function(){
      if(this.selected.length !== this.table1.data.length){
        this.selectAll = false;
      } else if(this.selected.length === this.table1.data.length){
        this.selectAll = true;
      }
    }
  },
  methods: {
    toggleModal: function(origin){
      if(origin === "addStock") {
        if(!this.$data.modalFlag) {
          if(this.selected.length > 0){
            this.$refs.addStockModal.open()
            this.quantity = new Array(this.selected.length);
            for(var i = 0; i < this.quantity.length; i++){
              this.quantity[i] = 0;
            }
            this.$data.modalFlag = true;
          } else {
            this.$refs.errorStockModal.open();
          }
        } else {
          this.$refs.addStockModal.close()
          this.quantity = [];
          this.$data.modalFlag = false;
        }
      } else if(origin === "removeStock") {
        if(!this.$data.modalFlag) {
          if(this.selected.length > 0){
            this.$refs.removeStockModal.open()
            this.quantity = new Array(this.selected.length);
            for(var i = 0; i < this.quantity.length; i++){
              this.quantity[i] = 0;
            }
            this.$data.modalFlag = true;
          } else {
            this.$refs.errorStockModal.open();
          }
        } else {
          this.$refs.removeStockModal.close()
          this.quantity = [];
          this.$data.modalFlag = false;
        }
      }
    },
    closeErrorModal(){
      this.$refs.errorStockModal.close()
    },
    isSelected(index) {
      return this.selected.indexOf(index) > -1;
    },
    getWidth(column) {
      return column === ""? "20%":""
    },
    hasValue(item, column) {
      return item[column.toLowerCase()] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.toLowerCase()];
    },
    getItemById(id){
      for(var i = 0; i < this.table1.data.length; i++){
        if(this.table1.data[i].id === id){
          return this.table1.data[i];
        }
      }
    },
    quantityChangeColumn(column){
      return column === "";
    },
    selectAllStocks() {
      this.selected = [];
      if (!this.selectAll) {
          for (let i in this.table1.data) {
            this.selected.push(this.table1.data[i].id);
        }
      } 
    },
    saveStock(origin) {
      if(origin === "addStock") {
          for(var i = 0; i < this.selected.length; i++){
            for(var j = 0; j < this.table1.data.length; j++){
              if(this.table1.data[j].id === this.selected[i]){
                this.table1.data[j].quantity = Number(this.table1.data[j].quantity) + Number(this.quantity[i]);
                this.table1.data[j].quantity = this.table1.data[j].quantity.toString();
                break;
              }
            }
          }
          this.$refs.addStockModal.close()
          this.quantity = [];
          this.$data.modalFlag = false;
      } else if(origin === "removeStock") {
          for(var i = 0; i < this.selected.length; i++){
            for(var j = 0; j < this.table1.data.length; j++){
              if(this.table1.data[j].id === this.selected[i]){
                this.table1.data[j].quantity = Number(this.table1.data[j].quantity) - Number(this.quantity[i]);
                this.table1.data[j].quantity = this.table1.data[j].quantity.toString();
                break;
              }
            }
          }
          this.$refs.removeStockModal.close()
          this.quantity = [];
          this.$data.modalFlag = false;
      }
    },
    quantityChange(event, i, index, origin){
      event.preventDefault();
      var val = Number(event.target.value);
      var item = this.getItemById(i);
      if(val < 0){
        this.quantity[index] = 0;
      } else if(val > Number(item.quantity)){
        if(origin === 'removeStock'){
          this.quantity[index] = item.quantity;
        }
      }
      this.$forceUpdate();
    }
  }
};
</script>
<style>
</style>
