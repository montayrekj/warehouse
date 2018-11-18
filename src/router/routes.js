import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";
import Profile from "@/pages/Profile.vue";
import In from "@/pages/Stocks/In.vue";
import Out from "@/pages/Stocks/Out.vue";
import Products from "@/pages/Products/Products.vue";
import AddProduct from "@/pages/Products/AddProduct.vue";
import UpdateProduct from "@/pages/Products/UpdateProduct.vue";
import Purchases from "@/pages/Logs/Purchases.vue";
import Login from "@/pages/Login.vue";
import Collections from "@/pages/Collections.vue";
import Sales from "@/pages/Logs/Sales.vue";
import PurchaseDetail from "@/pages/Logs/PurchaseDetail.vue"
import SalesDetail from "@/pages/Logs/SalesDetail.vue"

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
        path: "/stocks/in",
        name: "stocks > add stocks",
        component: In
      },
      {
        path: "/stocks/out",
        name: "stocks > sell stocks",
        component: Out
      },
      {
        path: "profile",
        name: "profile",
        component: Profile
      },
      {
        path: "products/addProduct",
        name: "products > add product",
        component: AddProduct
      },
      {
        path: "products/updateProduct/:id",
        name: "products > update > ",
        component: UpdateProduct
      },
      {
        path: "products/viewProducts",
        name: "products > view products",
        component: Products
      },
      {
        path: "reports/collections",
        name: "collections",
        component: Collections
      },
      {
        path: "logs/purchases",
        name: "logs > purchases",
        component: Purchases
      },
      {
        path: "logs/purchases/:id",
        name: "logs > purchases > ",
        component: PurchaseDetail
      },
      {
        path: "logs/sales",
        name: "logs > sales",
        component: Sales
      },
      {
        path: "logs/sales/:id",
        name: "logs > sales > ",
        component: SalesDetail
      },
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
