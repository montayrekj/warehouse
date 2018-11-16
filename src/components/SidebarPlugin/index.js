import Sidebar from "./SideBar.vue";
import SidebarLink from "./SidebarLink";

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [],
  logsFlag: false,
  reportsFlag: false,
  toggleLogs(value) {
    this.logsFlag = value;
  },
  toggleReports(value) {
    this.reportsFlag = value;
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
