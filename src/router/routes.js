import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import Notifications from "@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import Stocks from "@/pages/Stocks.vue";
import Products from "@/pages/Products.vue";
import Purchases from "@/pages/Purchases.vue";
import Login from "@/pages/Login.vue";
import Collections from "@/pages/Collections.vue";
import Sales from "@/pages/Sales.vue";

const routes = [
  { path: "/login", component: Login },
  {
    path: "/",
    component: DashboardLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: Dashboard
      },
      {
        path: "profile",
        name: "profile",
        component: Profile
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "maps",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: Typography
      },
      {
        path: "stocks",
        name: "stocks",
        component: Stocks,
      },
      {
        path: "products",
        name: "products",
        component: Products
      },
      {
        path: "reports/collections",
        name: "collections",
        component: Collections
      },
      {
        path: "purchases",
        name: "purchases",
        component: Purchases
      },
      {
        path: "sales",
        name: "sales",
        component: Sales
      }
    ]
  },
  { path: "*", component: NotFound },
];

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

export default routes;
