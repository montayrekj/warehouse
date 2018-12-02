<template>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); overflow: auto">
          <div style="padding-bottom: 10px">
            <div class="row">
              <div class="col-md-3">
                <input type="text" placeholder="Search" v-model="search" class="form-control" />
              </div>
              <div class="col-md-5"></div>
              <div class="col-md-2 pull-right">
              <button class="btn btn-success" style="width: 100%" v-on:click="toggleModal('addStock')">In</button></div>
              <div class="col-md-2 pull-right">
              <button class="btn btn-danger" style="width: 100%" v-on:click="toggleModal('removeStock')">Out</button></div>
            </div>
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
                  <th v-for="(column, index) in tableColumns" :key="index">{{column.Header}}</th>
                </slot>
              </tr>
              </thead>
              <tbody :class="tbodyClasses">
              <tr v-for="(item) in table.data" :key="item.productId">
                <slot :row="item">
                  <td>
                    <div class="form-check">
                    <label class="form-check-label">
                        <input class="form-check-input" type="checkbox" :value="item.productId" v-model="selected">
                      <span class="form-check-sign"></span>
                      </label>
                    </div>
                  </td>
                  <td v-for="(column, index) in tableColumns"
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
      <sweet-modal ref="errorStockModal" icon="error" hide-close-button overlay-theme="dark" modal-theme="dark" title="Oops!" :enable-mobile-fullscreen="false">
        Please select a Stock inorder to Add/Reduce Stocks.
        <button slot="button" v-on:click="closeErrorModal()" class="btn btn-sm btn-success">Fine!</button>
      </sweet-modal>
      <!-- Add Stocks Modal -->
      <sweet-modal ref="addStockModal" class="stocksModal" hide-close-button overlay-theme="dark" modal-theme="dark" title="Add Stocks" :enable-mobile-fullscreen="false">
        <div class="table-responsive">
          <table class="table tablesorter" :class="tableClass">
            <thead class="text-primary">
            <tr>
              <slot name="columns">
                <th v-for="(column, index) in modalColumnsIn" :key="index" :width="getWidth(column.Header)">{{column.Header}}</th>
              </slot>
            </tr>
            </thead>
            <tbody :class="tbodyClasses">
            <tr v-for="(i, indexTemp) in selected" :key="indexTemp">
              <slot :row="i">
                <td v-for="(column, index) in modalColumnsIn"
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
        </div>
        <button slot="button" v-on:click="saveStock('addStock')" class="btn btn-sm btn-success" style="margin-right: 5px">Save</button>
        <button slot="button" v-on:click="toggleModal('addStock')" class="btn btn-sm btn-danger">Cancel</button>
      </sweet-modal>

      <!-- Remove Stocks Modal -->
      <sweet-modal ref="removeStockModal" class="stocksModal" hide-close-button overlay-theme="dark" modal-theme="dark" title="Reduce Stocks" :enable-mobile-fullscreen="false">
        <div class="row form-group">
          <div class="col-3">
            <label class="control-label">Customer Name </label>
          </div>
          <div class="col-9">
            <input aria-describedby="addon-right addon-left" class="form-control">
          </div>
        </div>
        <card style="background-color: #2b3b4c">
          <div class="table-responsive">
            <table class="table tablesorter" :class="tableClass">
              <thead class="text-primary">
                <tr>
                  <slot name="columns">
                    <th v-for="(column, index) in modalColumnsOut" :key="index" :width="getWidth(column.Header)">{{column.Header}}</th>
                  </slot>
                </tr>
              </thead>
              <tbody :class="tbodyClasses">
                <tr v-for="(i, indexTemp) in selected" :key="indexTemp">
                  <slot :row="i">
                    <td v-for="(column, index) in modalColumnsOut"
                        :key="index"
                        v-if="hasValue(getItemById(i), column)">
                      {{itemValue(getItemById(i), column)}}
                      <input v-if="quantityChangeColumn(column)" 
                        type="number" 
                        class="form-control" 
                        id="stockQuantity" 
                        style="background-color: #1c2a38"
                        min="0"
                        @change="quantityChange($event, i, indexTemp,'removeStock')"
                        v-model="quantity[indexTemp]">
                    </td>
                  </slot>
                </tr>
              </tbody>
            </table>
          </div>
        </card>
        <div class="row">
          <div class= "col-4" style="padding-top: 10px">
            <label class="control-label">Grand Total</label>
          </div>
          <div>
            <input type="number" class="form-control" style="background-color: #1c2a38;" min="0" v-model="grandTotal" disabled>
          </div>
        </div>
        <br>
        <card style="background-color: #2b3b4c">
          <div class="row">
            <div class="col-3" style="padding-top: 8px">
              <label class="control-label">Payment Method </label>
            </div>
            <base-checkbox :name="'Cash'" v-model="paymentMethodCash">Cash</base-checkbox>
            <div class="col-2">
              <base-checkbox :name="'Cheque'" v-model="paymentMethodCheque">Cheque</base-checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col-3" style="padding-top: 8px">
              <label class="control-label">Payment Type </label>
            </div>
            <base-radio :name="'Full'" v-model="paymentType" :disabled="true">Full</base-radio>
            <div class="col-2">
              <base-radio :name="'Partial'" v-model="paymentType" :disabled="true">Partial</base-radio>
            </div>
          </div>
          <div class="row" v-if="paymentMethodCash == true && paymentType != ''">
            <div class="col-3" style="padding-top: 10px">
              <label class="control-label">Amount in Cash </label>
            </div>
            <div class="col-3">
              <input type="number" 
              class="form-control" style="background-color: #1c2a38" 
              placeholder="0" min="0" v-model="amountInCash">
            </div>
          </div>
          <div class="row" v-if="paymentMethodCheque == true && paymentType != ''">
            <div class="col-3" style="padding-top: 10px">
              <label class="control-label">Amount in Cheque </label>
            </div>
            <div class="col-3">
              <input type="number" 
              class="form-control" style="background-color: #1c2a38" 
              placeholder="0" min="0" v-model="amountInCheque">
            </div>
            <div class="col-3" style="padding-top: 10px">
              <label class="control-label">Cheque Due Date </label>
            </div>
            <div class="col-3">
              <input type="text" 
              class="form-control" placeholder="mm/dd/yyyy" style="background-color: #1c2a38" v-model="chequeDueDate">
            </div>
          </div>
          <div class="row">
            <div class="col-3" style="padding-top: 10px">
              <label class="control-label">Balance </label>
            </div>
            <div class="col-3">
              <input type="number" class="form-control" style="background-color: #1c2a38" v-model="balance" disabled>
            </div>
          </div>
          <div style="padding-top: 10px">
            <label class="control-label">Remarks</label>
          </div>
          <div>
            <textarea class="form-control" 
              style="background-color: #1c2a38; 
                  border-radius: 5px;
                  padding: 0.5rem 0.7rem;
                  line-height: 1.125rem;" 
              v-model="remarks">
            </textarea>
          </div>
        </card>
        <button slot="button" v-on:click="saveStock('removeStock')" class="btn btn-sm btn-success" style="margin-right: 5px">Save</button>
        <button slot="button" v-on:click="toggleModal('removeStock')" class="btn btn-sm btn-danger">Cancel</button>
      </sweet-modal>
    </div>
</template>
<script>
  import { BaseTable } from "@/components";
  import { BaseRadio } from "@/components";
  import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
  const tableColumns = ["Name", "Code", "Quantity", "Unit",  "Price", "Supplier"];
  const entityColumns = ["productName", "productCode", "quantity", "unit",  "price", "supplier"];
  const modalColumns = ["Name", "Quantity", "Unit", "Price", "Supplier", ""]
  export default {
    components: {
      SweetModal,
      SweetModalTab,
      BaseRadio
    },
    data() {
      return {
        table: {
          columns: [...tableColumns],
          data: this.products,
          modalColumns: [...modalColumns]
        },
        modalFlag: false,
        selected: [],
        selectAll: false,
        type: '',
        tbodyClasses: '',
        quantity: [],
        search: '',
        grandTotal: 0,
        paymentMethodCash: false,
        paymentMethodCheque: false,
        paymentType: 'Partial',
        amountInCash: 0,
        amountInCheque: 0,
        balance: 0,
        chequeDueDate: null,
        remarks: null,
      };
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      tableColumns() {
        return this.$t('stocks.tableColumns');
      },
      modalColumnsIn() {
        return this.$t('stocks.modalColumnsIn');
      },
      modalColumnsOut() {
        return this.$t('stocks.modalColumnsOut');
      },
      stocksPaid() {
          return this.$t('stocks.paid');
        }
    },
    props: {
      sample: Boolean,
      products: Array,
    },
    watch: {
      products() {
        this.table.data = this.products
      },
      selected: function() {
        if(this.selected.length !== this.table.data.length){
          this.selectAll = false;
        } else if(this.selected.length === this.table.data.length){
          this.selectAll = true;
        }
      },
      search: function () {
        if(this.search != '') {
          this.table.data = [...tableData].filter(item => 
            item.productName.toUpperCase().includes(this.search.toUpperCase()) || 
            item.produtCode.toUpperCase().includes(this.search.toUpperCase()) || 
            item.quantity.includes(this.search) ||
            item.unit.toUpperCase().includes(this.search.toUpperCase()) || 
            item.buyPrice.includes(this.search) ||
            item.sellPrice.includes(this.search) ||
            item.supplier.toUpperCase().includes(this.search.toUpperCase()));
        }
        else
          this.table.data = [...tableData];
      },
      paymentMethodCash: function() {
        if(this.paymentMethodCash == false) {
          this.amountInCash = 0;
          this.balance = this.computeBalance(this.balance, this.amountInCash);
        }
      },
      paymentMethodCheque: function() {
        if(this.paymentMethodCheque == false) {
          this.amountInCheque = 0;
          this.chequeDueDate = null;
          this.balance = this.computeBalance(this.balance, this.amountInCheque);
        }
      },
      amountInCash: function () {
        this.balance = this.computeBalance(this.grandTotal, (Number(this.amountInCash) + Number(this.amountInCheque)));
      },
      amountInCheque: function () {
        this.balance = this.computeBalance(this.grandTotal, (Number(this.amountInCash) + Number(this.amountInCheque)));
      },
      balance: function() {
        if(this.balance == 0)
          this.paymentType = 'Full';
        else
          this.paymentType = 'Partial';
      },
      grandTotal: function() {
        this.balance = this.computeBalance(this.grandTotal, (Number(this.amountInCash) + Number(this.amountInCheque)));
      }
    },
    methods: {
      toggleModal: function(origin){
        this.$emit("changeSample", !this.sample)
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
            this.grandTotal = 0;
            this.$data.modalFlag = false;
          }
        } else if(origin === "removeStock") {
          this.setToDefaultValue();
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
            this.grandTotal = 0;
            this.$data.modalFlag = false;
          }
        }
      },
      closeErrorModal(){
        this.$emit("changeSample", !this.sample)
        this.$refs.errorStockModal.close()
      },
      isSelected(index) {
        return this.selected.indexOf(index) > -1;
      },
      getWidth(column) {
        return column === ""? "20%":""
      },
      hasValue(item, column) {
        return item[column.Item] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.Item];
      },
      getItemById(id){
        for(var i = 0; i < this.table.data.length; i++){
          if(this.table.data[i].productId === id){
            return this.table.data[i];
          }
        }
      },
      quantityChangeColumn(column){
        return column.Header === "";
      },
      selectAllStocks() {
        this.selected = [];
        if (!this.selectAll) {
            for (let i in this.table.data) {
              this.selected.push(this.table.data[i].productId);
          }
        } 
      },
      saveStock(origin) {
        if(origin === "addStock") {
            for(var i = 0; i < this.selected.length; i++){
              for(var j = 0; j < this.table.data.length; j++){
                if(this.table.data[j].productId === this.selected[i]){
                  this.table.data[j].quantity = Number(this.table.data[j].quantity) + Number(this.quantity[i]);
                  this.table.data[j].quantity = this.table.data[j].quantity;
                  break;
                }
              }
            }
            this.$refs.addStockModal.close()
            this.quantity = [];
            this.$data.modalFlag = false;
        } else if(origin === "removeStock") {
            for(var i = 0; i < this.selected.length; i++){
              for(var j = 0; j < this.table.data.length; j++){
                if(this.table.data[j].productId === this.selected[i]){
                  this.table.data[j].quantity = Number(this.table.data[j].quantity) - Number(this.quantity[i]);
                  this.table.data[j].quantity = this.table.data[j].quantity;
                  break;
                }
              }
            }
            this.$refs.removeStockModal.close()
            this.quantity = [];
            this.$data.modalFlag = false;
        }
        this.$emit("addStocks", this.table.data)
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
        this.computeGrandTotal(item);
        this.$forceUpdate();
      },
      computeGrandTotal(item) {
        this.grandTotal = 0;
        for(var i=0; i<this.quantity.length; i++) {
          this.grandTotal += (item.sellPrice * this.quantity[i]);
        }
      },
      setToDefaultValue() {
        //sets field to defaut value
        this.paymentMethodCash = false;
        this.paymentMethodCheque = false;
        this.paymentType = 'Partial';
        this.amountInCash =  null;
        this.amountInCheque = null;
        this.chequeDueDate = null;
      },
      computeBalance(totalAmount, paidAmount)  {
        var balance = 0;
        totalAmount = Number(totalAmount);
        paidAmount = Number(paidAmount);
        if(paidAmount >= totalAmount)
          balance = 0;
        else
          balance = totalAmount - paidAmount;

        return balance;
      }
    },
  };
</script>
<style>
</style>
