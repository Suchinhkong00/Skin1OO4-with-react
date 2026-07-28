import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { OrdersProvider } from "./context/OrdersContext";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <HashRouter>
        <AuthProvider>
          <ProductsProvider>
            <CartProvider>
              <OrdersProvider>
                <App />
              </OrdersProvider>
            </CartProvider>
          </ProductsProvider>
        </AuthProvider>
      </HashRouter>
    </ErrorBoundary>
  </React.StrictMode>
);