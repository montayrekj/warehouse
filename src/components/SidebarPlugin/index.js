import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink";

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  ordersFlag: false,
  reportsFlag: false,
  stocksFlag: false,
  productsFlag: false,
  toggleOrders(value) {
    this.ordersFlag = value;
    this.reportsFlag = false;
    this.stocksFlag = false;
    this.productsFlag = false;
  },
  toggleReports(value) {
    this.reportsFlag = value;
    this.ordersFlag = false;
    this.stocksFlag = false;
    this.productsFlag = false;
  },
  toggleStocks(value) {
    this.stocksFlag = value;
    this.ordersFlag = false;
    this.reportsFlag = false;
    this.productsFlag = false;
  },
  toggleProducts(value) {
    this.productsFlag = value;
    this.ordersFlag = false;
    this.reportsFlag = false;
    this.stocksFlag = false;
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
