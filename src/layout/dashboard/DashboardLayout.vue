<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36"/>
        <sidebar-link to="/stocks" :name="$t('sidebar.stocks')" icon="tim-icons icon-chart-bar-32"/>
        <sidebar-link to="/products" :name="$t('sidebar.products')" icon="tim-icons icon-bullet-list-67"/>
        <sidebar-link to="/paymentBacklogs" :name="$t('sidebar.paymentBacklogs')" icon="tim-icons icon-wallet-43"/>
        <sidebar-link to="/logs" :name="$t('sidebar.logs')" icon="tim-icons icon-notes"/>
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
export default {
  data() {
    return {
      sample: false
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
    }
  }
};
</script>
