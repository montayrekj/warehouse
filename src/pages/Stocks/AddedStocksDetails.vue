<template>
    <div class="row" style="max-height: calc(100vh - 88px);">
      <div class="col-12">
        <card style="max-height: calc(100vh - 88px); overflow: auto">
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
            </table>
          </div>
        </card>
      </div>
    </div>
</template>
<script>

  import axios from 'axios';
  import config from '@/config'
  export default {
    data() {
      return {
        table: {
          data: [],
        }
      }
    },
    computed: {
      tableColumns() {
        return this.$t('AddedStocksDetail.tableColumns');
      }
    },
    methods: {
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
      }
    },
    mounted() {
      var formData = new FormData();
      formData.append("id", this.$route.params.id)
      axios
          .post(config.backend_host + '/getPurchasesLogsById', formData)
          .then(response => {
            if(response.data.statusCode === "OK"){
              this.table.data = response.data.data.purchasesLogsItem
            }
          })
    }
  };
</script>
<style>
</style>
