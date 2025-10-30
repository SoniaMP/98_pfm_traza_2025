import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import App from "./App";
import theme from "./styles/theme";
import MetamaskProvider from "./context/metamask/provider";
import GlobalProvider from "./context/global/provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MetamaskProvider>
          <GlobalProvider>
            <App />
          </GlobalProvider>
        </MetamaskProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
