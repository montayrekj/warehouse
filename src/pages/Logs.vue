<template>
  <div>
    <div class="row">
      <div class="col-12">
        <card type="chart">
          <template slot="header">
            <div class="row">
              <div class="col-sm-6">
                <div class="btn-group btn-group-toggle"
                     :class="'float-left'"
                     data-toggle="buttons">
                  <label v-for="(option, index) in logsCategories"
                         :key="option"
                         class="btn btn-sm btn-primary btn-simple"
                         :class="{active: table1.activeIndex === index}"
                         :id="index">
                    <input type="radio"
                           @click="updateTable(index)"
                           name="options" autocomplete="off"
                           :checked="table1.activeIndex === index">
                    {{option}}
                  </label>
                </div>
              </div>
            </div>
          </template>
          <div>
            <div class="col-12">
                <div class="table-responsive">
                  <table class="table tablesorter" :class="tableClass">
                    <thead class="text-primary">
                    <tr>
                      <slot name="columns" style="text-align: center">
                        <th v-for="column in table1.columns" :key="column">{{column}}</th>
                      </slot>
                    </tr>
                    </thead>
                    <tbody :class="tbodyClasses">
                    <tr v-for="(item, index) in table1.data" :key="index">
                      <slot :row="item">
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
            </div>
          </div>
        </card>
      </div>
    </div>
  </div>
</template>
<script>
  import { BaseTable } from "@/components";
  import { SweetModal, SweetModalTab } from 'sweet-modal-vue';

  const tableColumns = ["Name", "Code", "Quantity", "Unit",  "Price"];
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
      SweetModalTab
    },
    data() {
      return {
        table1: {
          columns: [...tableColumns],
          data: [...tableData],
          activeIndex: 0
        }
      };
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      logsCategories() {
        return this.$t('logs.logsCategories');
      }
    },
    methods: {
      hasValue(item, column) {
        return item[column.toLowerCase()] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.toLowerCase()];
      },
      updateTable(index) {
        let updatedTableDataAddedStocks = [
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
          }
        ]
        let updatedTableDataReducedStocks = [
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
          }
        ]
        switch(index){
          case 0 : 
            this.table1.data = tableData;
            break;
          case 1:
            this.table1.data = updatedTableDataAddedStocks;
            break;
          case 2: 
            this.table1.data = updatedTableDataReducedStocks;
            break;
        }
        this.table1.activeIndex = index;
      }
    }
  };
</script>
<style>
</style>
