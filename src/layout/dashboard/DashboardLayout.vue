<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36"/>
        <!--sidebar-link to="/stocks" :name="$t('sidebar.stocks')" icon="tim-icons icon-chart-bar-32"/-->
        <!--sidebar-link to="/products" :name="$t('sidebar.products')" icon="tim-icons icon-bullet-list-67"/-->
        <li class="nav-item">
          <a class="nav-link" @click="toggleProducts()">
            <i class="tim-icons icon-bullet-list-67"></i>
            <p>
              Products
              <i v-if="!this.$sidebar.productsFlag" class="tim-icons icon-minimal-right" style="float:right; font-size:12px;"></i>
              <i v-if="this.$sidebar.productsFlag" class="tim-icons icon-minimal-down" style="float:right; font-size:12px;"></i>
            </p>
          </a>
          <ul style="list-style-type: none; margin-left: 20px;" v-if="this.$sidebar.productsFlag">
            <sidebar-link to="/products/addProduct" :name="$t('sidebar.addProduct')"/>
            <sidebar-link to="/products/viewProducts" :name="$t('sidebar.viewProducts')"/>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="toggleStocks()">
            <i class="tim-icons icon-chart-bar-32"></i>
            <p>
              Stocks
              <i v-if="!this.$sidebar.stocksFlag" class="tim-icons icon-minimal-right" style="float:right; font-size:12px;"></i>
              <i v-if="this.$sidebar.stocksFlag" class="tim-icons icon-minimal-down" style="float:right; font-size:12px;"></i>
            </p>
          </a>
          <ul style="list-style-type: none; margin-left: 20px;" v-if="this.$sidebar.stocksFlag">
            <sidebar-link to="/stocks/addStocks" :name="$t('sidebar.addStocks')"/>
            <sidebar-link to="/stocks/viewAddedStocks" :name="$t('sidebar.viewAddedStocks')"/>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link" @click="toggleOrders()">
            <i class="tim-icons icon-notes"></i>
            <p>
              Orders
              <i v-if="!this.$sidebar.ordersFlag" class="tim-icons icon-minimal-right" style="float:right; font-size:12px;"></i>
              <i v-if="this.$sidebar.ordersFlag" class="tim-icons icon-minimal-down" style="float:right; font-size:12px;"></i>
            </p>
          </a>
          <ul style="list-style-type: none; margin-left: 20px;" v-if="this.$sidebar.ordersFlag">
            <sidebar-link to="/orders/placeOrder" :name="$t('sidebar.placeOrder')"/>
            <sidebar-link to="/orders/viewActiveOrders" :name="$t('sidebar.viewActiveOrders')"/>
            <sidebar-link to="/orders/viewCompletedOrders" :name="$t('sidebar.viewCompletedOrders')"/>
          </ul>
        </li>

        <li class="nav-item">
          <a class="nav-link" @click="toggleReports()">
            <i class="tim-icons icon-map-big"></i>
            <p>
              Reports
              <i v-if="!this.$sidebar.reportsFlag" class="tim-icons icon-minimal-right" style="float:right; font-size:12px;"></i>
              <i v-if="this.$sidebar.reportsFlag" class="tim-icons icon-minimal-down" style="float:right; font-size:12px;"></i>
            </p>
          </a>
          <ul style="list-style-type: none; margin-left: 20px;" v-if="this.$sidebar.reportsFlag">
            <sidebar-link to="/reports/collections" :name="$t('sidebar.collections')"/>
            <sidebar-link to="/reports/sales" :name="$t('sidebar.sales')"/>
            <sidebar-link to="/reports/stocks" :name="$t('sidebar.stocks')"/>
          </ul>
        </li>
        
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar" :sample="sample" @changeSample2="changeSample2" v-bind:style="style">

      </dashboard-content>

    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu";
import router from "@/router/routes.js"
export default {
  data() {
    return {
      sample: false,
    }
  },
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu
  },
  computed: {
    style() {
      if(!this.sample)
        return "z-index: 0; top: 0;right: 0; bottom: 0; left: 0; position: fixed;"
    }
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    changeSample2(event) {
      this.sample = event
    },
    toggleOrders() {
      this.$sidebar.toggleOrders(!this.$sidebar.ordersFlag);
    },
    toggleReports() {
      this.$sidebar.toggleReports(!this.$sidebar.reportsFlag);
    },
    toggleStocks() {
      this.$sidebar.toggleStocks(!this.$sidebar.stocksFlag);
    },
    toggleProducts() {
      this.$sidebar.toggleProducts(!this.$sidebar.productsFlag);
    }
  }
};
</script>
