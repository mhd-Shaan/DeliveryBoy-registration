import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from 'react-redux'
import store from './redux/store'; 

// If Hero UI requires a provider, add it here
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HeroUIProvider>
        <Provider store={store}>

      <App />
      </Provider>
    </HeroUIProvider>
  </React.StrictMode>
);
