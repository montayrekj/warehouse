<template>
  <div>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card type="chart" style="max-height: calc(100vh - 88px); overflow: scroll">
          <template slot="header">
            <div class="row">
              <div class="col-sm-12">
                <div class="btn-group btn-group-toggle"
                     :class="'float-right'" data-toggle="buttons">
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
                        <th v-for="column in logsTableColumns" :key="column" align:center>{{column}}</th>
                      </slot>
                    </tr>
                    </thead>
                    <tbody :class="tbodyClasses">
                    <tr v-for="(item, index) in table1.data" :key="index">
                      <slot :row="item">
                        <td v-for="(column, index) in logsTableColumns"
                            :key="index"
                            v-if="hasValue(item, column)">
                          <span v-if="column !== 'Type'">{{itemValue(item, column)}}</span>
                          <span v-if="column === 'Type' && itemValue(item, column) === 'Added'" 
                          style="background-image: linear-gradient(to bottom left, #00f2c3, #00b191, #00f2c3) !important;
                          padding: 4px 12px;
                          border-radius: 20px;">
                            {{itemValue(item, column)}}
                          </span>
                          <span v-if="column === 'Type' && itemValue(item, column) === 'Reduced'"
                          style="background-image: linear-gradient(to bottom left, #fd5d93, #ec250d, #fd5d93);
                          padding: 4px 12px;
                          border-radius: 20px;">
                            {{itemValue(item, column)}}
                          </span>
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
  
  const tableData = [
    {
      id: 1,
      name: "Ganador",
      code: "GNDR",
      quantity: "10",
      unit: "Sack",
      price: "54.00",
      date: "11/01/2018",
      type: "Added"

    },
    {
      id: 2,
      name: "Lion Ivory",
      code: "LNIVRY",
      quantity: "8",
      unit: "Sack",
      price: "50.00",
      date: "11/01/2018",
      type: "Added"
    },
    {
      id: 3,
      name: "NFA Rice",
      code: "NFA",
      quantity: "25",
      unit: "Kilo",
      price: "30.00",
      date: "11/01/2018",
      type: "Added"
    },
    {
      id: 4,
      name: "A Plus",
      code: "APLS",
      quantity: "15",
      unit: "Sack",
      price: "84.00",
      date: "11/01/2018",
      type: "Added"
    },
    {
      id: 5,
      name: "Pilit",
      code: "PLT",
      quantity: "50",
      unit: "Kilo",
      price: "45.00",
      date: "11/01/2018",
      type: "Reduced"
    },
    {
      id: 6,
      name: "Sinandomeng",
      code: "SNDMNG",
      quantity: "25",
      unit: "Sack",
      price: "51.00",
      date: "11/01/2018",
      type: "Reduced"
    },
    {
      id: 7,
      name: "Jasmine",
      code: "JSMN",
      quantity: "5",
      unit: "Sack",
      price: "58.00",
      date: "11/01/2018",
      type: "Reduced"
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
          data: [...tableData],
          activeIndex: 0
        },
        tbodyClasses: ''
      };
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      logsTableColumns() {
        return this.$t('logs.tableColumns');
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
            price: "54.00",
            date: "11/01/2018",
            type: "Added"

          },
          {
            id: 2,
            name: "Lion Ivory",
            code: "LNIVRY",
            quantity: "8",
            unit: "Sack",
            price: "50.00",
            date: "11/01/2018",
            type: "Added"
          },
          {
            id: 3,
            name: "NFA Rice",
            code: "NFA",
            quantity: "25",
            unit: "Kilo",
            price: "30.00",
            date: "11/01/2018",
            type: "Added"
          },
          {
            id: 4,
            name: "A Plus",
            code: "APLS",
            quantity: "15",
            unit: "Sack",
            price: "84.00",
            date: "11/01/2018",
            type: "Added"
          }
        ]
        let updatedTableDataReducedStocks = [
          {
            id: 5,
            name: "Pilit",
            code: "PLT",
            quantity: "50",
            unit: "Kilo",
            price: "45.00",
            date: "11/01/2018",
            type: "Reduced"
          },
          {
            id: 6,
            name: "Sinandomeng",
            code: "SNDMNG",
            quantity: "25",
            unit: "Sack",
            price: "51.00",
            date: "11/01/2018",
            type: "Reduced"
          },
          {
            id: 7,
            name: "Jasmine",
            code: "JSMN",
            quantity: "5",
            unit: "Sack",
            price: "58.00",
            date: "11/01/2018",
            type: "Reduced"
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
