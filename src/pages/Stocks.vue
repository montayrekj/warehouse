<template>
    <div class="row">
      <div class="col-12">
        <card :title="table1.title">
          <div class="pull-right" style="padding-bottom: 10px">
            <button class="btn btn-sm btn-success" style="margin-right: 5px" v-on:click="toggleModal('addStock')">Stock +</button>
            <button class="btn btn-sm btn-danger" v-on:click="toggleModal('removeStock')">Stock -</button>
          </div>
          <div class="table-responsive">
            <base-table :data="table1.data"
                        :columns="table1.columns"
                        thead-classes="text-primary">
            </base-table>
          </div>
        </card>
      </div>
      <sweet-modal ref="addStockModal" hide-close-button overlay-theme="dark" modal-theme="dark" title="Add Stocks">
        This is an error…

        <button slot="button" class="btn btn-sm btn-success" style="margin-right: 5px">Save</button>
        <button slot="button" v-on:click="toggleModal('addStock')" class="btn btn-sm btn-danger">Cancel</button>
      </sweet-modal>
      <sweet-modal ref="removeStockModal" hide-close-button overlay-theme="dark" modal-theme="dark" title="Remove Stocks">
        <div class="row">
          <span class="col-md-6" style="height: 35px;line-height: 35px;">Product Name: &nbsp Sample Product</span>
    
          <div class="col-md-5">
            <div class="row">
            <span style="height: 35px;line-height: 35px;margin-right: 10px">Quantity: </span>
            <input type="number" class="form-control col-md-4" id="stockQuantity" style="background-color: #1c2a38">
            </div>
          </div>
        </div>
        <button slot="button" class="btn btn-sm btn-success" style="margin-right: 5px">Save</button>
        <button slot="button" v-on:click="toggleModal('removeStock')" class="btn btn-sm btn-danger">Cancel</button>
      </sweet-modal>
    </div>
</template>
<script>
import { BaseTable } from "@/components";
import { SweetModal, SweetModalTab } from 'sweet-modal-vue'
const tableColumns = ["Name", "Country", "City", "Salary"];
const tableData = [
  {
    id: 1,
    name: "Dakota Rice",
    salary: "$36.738",
    country: "Niger",
    city: "Oud-Turnhout",
  },
  {
    id: 2,
    name: "Minerva Hooper",
    salary: "$23,789",
    country: "Curaçao",
    city: "Sinaai-Waas"
  },
  {
    id: 3,
    name: "Sage Rodriguez",
    salary: "$56,142",
    country: "Netherlands",
    city: "Baileux"
  },
  {
    id: 4,
    name: "Philip Chaney",
    salary: "$38,735",
    country: "Korea, South",
    city: "Overland Park"
  },
  {
    id: 5,
    name: "Doris Greene",
    salary: "$63,542",
    country: "Malawi",
    city: "Feldkirchen in Kärnten"
  },
  {
    id: 6,
    name: 'Mason Porter',
    salary: '$98,615',
    country: 'Chile',
    city: 'Gloucester'
  },
  {
    id: 7,
    name: 'Jon Porter',
    salary: '$78,615',
    country: 'Portugal',
    city: 'Gloucester'
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
        title: "Stocks",
        columns: [...tableColumns],
        data: [...tableData],
        selectedId: [1,3,6]
      },
      modalFlag: false
    };
  },
  methods: {
    toggleModal: function(origin){
      if(origin === "addStock") {
        if(!this.$data.modalFlag) {
          this.$refs.addStockModal.open()
          this.$data.modalFlag = true;
        } else {
          this.$refs.addStockModal.close()
          this.$data.modalFlag = false;
        }
      } else if(origin === "removeStock") {
        if(!this.$data.modalFlag) {
          this.$refs.removeStockModal.open()
          this.$data.modalFlag = true;
        } else {
          this.$refs.removeStockModal.close()
          this.$data.modalFlag = false;
        }
      }
    }
  }
};
</script>
<style>
</style>
