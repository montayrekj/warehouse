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
import ViewOrders from "@/pages/Orders/ViewOrders.vue";
import PlacedOrderDetails from "@/pages/Orders/PlacedOrderDetails.vue";

import Collections from "@/pages/Reports/Collections.vue";

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
        path: "/stocks/addStocks",
        name: "stocks > add stocks",
        component: AddStocks
      },
      {
        path: "stocks/viewAddedStocks",
        name: "stocks > view added stocks",
        component: ViewAddedStocks
      },
      {
        path: "stocks/viewAddedStocks/:id",
        name: "stocks > view added stocks > ",
        component: AddedStocksDetails
      },
      {
        path: "orders/placeOrder",
        name: "orders > place order",
        component: PlaceOrder
      },
      {
        path: "/orders/viewOrders",
        name: "orders > view orders ",
        component: ViewOrders
      },
      {
        path: "/orders/viewOrders/:id",
        name: "orders > view orders > ",
        component: PlacedOrderDetails
      },
      {
        path: "reports/collections",
        name: "collections",
        component: Collections
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
