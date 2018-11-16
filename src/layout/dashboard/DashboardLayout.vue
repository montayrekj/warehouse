<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36"/>
        <sidebar-link to="/stocks" :name="$t('sidebar.stocks')" icon="tim-icons icon-chart-bar-32"/>
        <sidebar-link to="/products" :name="$t('sidebar.products')" icon="tim-icons icon-bullet-list-67"/>
        <li class="nav-item">
          <a class="nav-link" @click="toggleLogs()">
            <i class="tim-icons icon-notes"></i>
            <p>
              Logs
              <i v-if="!this.$sidebar.logsFlag" class="tim-icons icon-minimal-right" style="float:right; font-size:12px;"></i>
              <i v-if="this.$sidebar.logsFlag" class="tim-icons icon-minimal-down" style="float:right; font-size:12px;"></i>
            </p>
          </a>
          <ul style="list-style-type: none; margin-left: 20px;" v-if="this.$sidebar.logsFlag">
            <sidebar-link to="/purchases" :name="$t('sidebar.purchases')"/>
            <sidebar-link to="/sales" :name="$t('sidebar.sales')"/>
          </ul>
        </li>

        <li class="nav-item">
          <a class="nav-link" @click="toggleReports()">
            <i class="tim-icons icon-wallet-43"></i>
            <p>
              Reports
              <i v-if="!this.$sidebar.reportsFlag" class="tim-icons icon-minimal-right" style="float:right; font-size:12px;"></i>
              <i v-if="this.$sidebar.reportsFlag" class="tim-icons icon-minimal-down" style="float:right; font-size:12px;"></i>
            </p>
          </a>
          <ul style="list-style-type: none; margin-left: 20px;" v-if="this.$sidebar.reportsFlag">
            <sidebar-link to="/reports/collections" :name="$t('sidebar.collections')"/>
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
    toggleLogs() {
      this.$sidebar.toggleLogs(!this.$sidebar.logsFlag);
      if(!this.$sidebar.logsFlag) {
        window.location.href = "/#/dashboard"
      }
    },
    toggleReports() {
      this.$sidebar.toggleReports(!this.$sidebar.reportsFlag);
      if(!this.$sidebar.reportsFlag) {
        window.location.href = "/#/dashboard"
      }
    }
  }
};
</script>
