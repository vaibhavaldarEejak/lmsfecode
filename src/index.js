import "react-app-polyfill/stable.js";
import "core-js";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import reportWebVitals from "./reportWebVitals.js";
import { Provider } from "react-redux";
import store from "./store.js";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
