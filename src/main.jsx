// main.jsx (or index.js)
import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/them.js"; // Import the theme you created
import AppRoutes from "./AppRoutes.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { PagesProvider } from "./context/PagesContext.jsx";
import { HelmetProvider } from "react-helmet-async";
import { WebsiteInfoProvider } from "./context/WebsiteInfoContext.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WebsiteInfoProvider>
      <PagesProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <HelmetProvider>
              <AppRoutes />
            </HelmetProvider>
          </ThemeProvider>
        </AuthProvider>
      </PagesProvider>
    </WebsiteInfoProvider>
  </React.StrictMode>
);
