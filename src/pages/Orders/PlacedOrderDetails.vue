<template>
  <div class="row" style="max-height: calc(100vh - 88px); overflow: auto">
    <div class="col-12">
      <card>
        <h2>Order Details</h2>
        <div class="row">
          <div class="col-md-7">
            <div style="padding-top: 10px">
              <label class="control-label" style="font-size: 15px">Customer Name </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 18px;"> Teresita Tala P. Rabago</label>
            </div>
          </div>
          <div class="col-md-3">
            <div style="padding-top: 10px;">
              <label class="control-label" style="font-size: 15px">Ordered from </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 18px;"> King Joshua M. Montayre</label>
            </div>
          </div>
          <div class="col-md-2">
            <div style="padding-top: 10px">
              <label class="control-label" style="font-size: 15px">Ordered Date </label>
            </div>
            <div style="padding-top: 10px;">
              <label class="label-content-color" style="font-size: 18px;">11/01/2018</label>
            </div>
          </div>
        </div>
        <br>
        <br>
        <div class="table-responsive">
          <table class="table tablesorter">
            <thead class="text-primary">
            <tr style="position: sticky; top: 0;">
              <slot name="columns" >
                <th v-for="(column, index) in tableColumns" :key="index" style="text-align: center;">{{column.Header}}</th>
                <th></th>
              </slot>
            </tr>
            </thead>
            <tbody>
              <tr v-for="(item,indexTemp) in table.data" :key="indexTemp">
                <slot :row="item">
                  <td v-for="(column, index) in tableColumns"
                      :key="index"
                      v-if="hasValue(item, column)" style="text-align: center">
                    {{itemValue(item, column)}}
                  </td>
                </slot>
              </tr>
            </tbody>
            <tfoot class="text-primary">
                <tr>
                  <td></td><td></td><td></td><td></td>
                  <td style="text-align:center; font-weight:bold; padding-top: 40px">TOTAL AMOUNT</td>
                  <td style="text-align:center; font-weight:bold; padding-top: 40px">{{totalAmount}}</td>
                </tr>
              </tfoot>
          </table>
        </div>
      </card>
      <card v-if="showCardByUserType(regionalManager)">
        <h2>Regional Manager</h2>
      </card>
      <card v-if="showCardByUserType(accounting)">
        <h2>Accounting</h2>
      </card>
      <card v-if="showCardByUserType(checker)">
        <h2>Checker</h2>
      </card>
    </div>
  </div>
</template>
<script>

import axios from 'axios';
import config from '@/config'
import { POINT_CONVERSION_COMPRESSED } from 'constants';
export default {
  data() {
    return {
      table: {
        data: [],
      },
      totalAmount: 1500.00,
      userType: null,
    }
  },
  computed: {
    tableColumns() {
      return this.$t('PlacedOrderDetails.tableColumns');
    },
    regionalManager() {
      return this.$t('userType.regionalManager')
    },
    accounting() {
      return this.$t('userType.accounting')
    },
    checker() {
      return this.$t('userType.checker')
    },
    admin() {
      return this.$t('userType.admin')
    }
  },
  methods: {
    hasValue(item, column) {
      return item[column.Item] !== "undefined";
    },
    itemValue(item, column) {
      return item[column.Item];
    },
    showCardByUserType(userType){
      return userType == this.userType;
    }
  },
  mounted() {
    var formData = new FormData();
    formData.append("id", this.$route.params.id)
    axios
        .post(config.backend_host + '/getSalesLogsById', formData)
        .then(response => {
          if(response.data.statusCode === "OK"){
            this.table.data = response.data.data.salesLogsItem
          }
        })

    var user = JSON.parse(localStorage.getItem("user"))
    this.userType = Number(user.usertype);
  }
};
</script>
<style>
</style>
