import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";

import Products from "@/pages/Products/Products.vue";
import AddProduct from "@/pages/Products/AddProduct.vue";
import UpdateProduct from "@/pages/Products/UpdateProduct.vue";

import AddStocks from "@/pages/Stocks/AddStocks.vue";
import ViewAddedStocks from "@/pages/Stocks/ViewAddedStocks.vue";
import AddedStocksDetails from "@/pages/Stocks/AddedStocksDetails.vue"

import PlaceOrder from "@/pages/Orders/PlaceOrder.vue";
import ViewActiveOrders from "@/pages/Orders/ViewActiveOrders.vue";
import ViewCompletedOrders from "@/pages/Orders/ViewCompletedOrders.vue";
import PlacedOrderDetails from "@/pages/Orders/PlacedOrderDetails.vue";

import Collections from "@/pages/Reports/Collections.vue";
import Sales from "@/pages/Reports/Sales.vue";
import Stocks from "@/pages/Reports/Stocks.vue";

import Login from "@/pages/Login.vue";

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
        path: "products/addProduct",
        name: "add product",
        component: AddProduct
      },
      {
        path: "products/updateProduct/:id",
        name: "update > ",
        component: UpdateProduct
      },
      {
        path: "products/viewProducts",
        name: "view products",
        component: Products
      },
      {
        path: "/stocks/addStocks",
        name: "add stocks",
        component: AddStocks
      },
      {
        path: "stocks/viewAddedStocks",
        name: "view added stocks",
        component: ViewAddedStocks
      },
      {
        path: "stocks/viewAddedStocks/:id",
        name: "view added stocks > ",
        component: AddedStocksDetails
      },
      {
        path: "orders/placeOrder",
        name: "place order",
        component: PlaceOrder
      },
      {
        path: "/orders/viewActiveOrders",
        name: "view active orders ",
        component: ViewActiveOrders
      },
      {
        path: "/orders/viewCompletedOrders",
        name: "view completed orders ",
        component: ViewCompletedOrders
      },
      {
        path: "/orders/viewOrders/:id",
        name: "view orders > ",
        component: PlacedOrderDetails
      },
      {
        path: "reports/collections",
        name: "collections",
        component: Collections
      },
      {
        path: "reports/sales",
        name: "sales",
        component: Sales
      },
      {
        path: "reports/stocks",
        name: "stocks",
        component: Stocks
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
