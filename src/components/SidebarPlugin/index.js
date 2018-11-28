import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink";

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  ordersFlag: false,
  reportsFlag: false,
  stocksFlag: false,
  productsFlag: false,
  customersFlag: false,
  suppliersFlag: false,
  toggleOrders(value) {
    this.ordersFlag = value;
    this.reportsFlag = false;
    this.stocksFlag = false;
    this.productsFlag = false;
    this.customersFlag = false;
    this.suppliersFlag = false;
  },
  toggleReports(value) {
    this.reportsFlag = value;
    this.ordersFlag = false;
    this.stocksFlag = false;
    this.productsFlag = false;
    this.customersFlag = false;
    this.suppliersFlag = false;
  },
  toggleStocks(value) {
    this.stocksFlag = value;
    this.ordersFlag = false;
    this.reportsFlag = false;
    this.productsFlag = false;
    this.customersFlag = false;
    this.suppliersFlag = false;
  },
  toggleProducts(value) {
    this.productsFlag = value;
    this.ordersFlag = false;
    this.reportsFlag = false;
    this.stocksFlag = false;
    this.customersFlag = false;
    this.suppliersFlag = false;
  },
  toggleCustomers(value) {
    this.customersFlag = value;
    this.ordersFlag = false;
    this.reportsFlag = false;
    this.stocksFlag = false;
    this.productsFlag = false;
    this.suppliersFlag = false;
  },
  toggleSuppliers(value) {
    this.suppliersFlag = value;
    this.ordersFlag = false;
    this.reportsFlag = false;
    this.stocksFlag = false;
    this.customersFlag = false;
    this.productsFlag = false;
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
