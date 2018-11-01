<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36"/>
        <sidebar-link to="/stocks" :name="$t('sidebar.stocks')" icon="tim-icons icon-chart-bar-32"/>
        <sidebar-link to="/products" :name="$t('sidebar.products')" icon="tim-icons icon-bullet-list-67"/>
        <sidebar-link to="/logs" :name="$t('sidebar.logs')" icon="tim-icons icon-notes"/>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar" style="top: 0;right: 0; bottom: 0; left: 0; position: fixed;">

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
  components: {
    TopNavbar,
    DashboardContent,
    MobileMenu
  },
  props: {
    sample: Boolean
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
