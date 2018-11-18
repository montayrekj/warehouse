import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink";

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  logsFlag: false,
  reportsFlag: false,
  stocksFlag: false,
  productsFlag: false,
  toggleLogs(value) {
    this.logsFlag = value;
  },
  toggleReports(value) {
    this.reportsFlag = value;
  },
  toggleStocks(value) {
    this.stocksFlag = value;
  },
  toggleProducts(value) {
    this.productsFlag = value;
  },
  displaySidebar(value) {
    this.showSidebar = value;
  }
};

const SidebarPlugin = {
  install(Vue) {
    let app = new Vue({
      data: {
        sidebarStore: SidebarStore
      }
    });

    Vue.prototype.$sidebar = app.sidebarStore;
    Vue.component("side-bar", Sidebar);
    Vue.component("sidebar-link", SidebarLink);
  }
};

export default SidebarPlugin;
