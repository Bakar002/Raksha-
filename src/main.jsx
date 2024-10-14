// main.jsx (or index.js)
import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";

import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/theme.js"; // Correct import path
import AppRoutes from "./AppRoutes.jsx";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { PagesProvider } from "./context/PagesContext.jsx";
import { HelmetProvider } from "react-helmet-async";
import { WebsiteInfoProvider } from "./context/WebsiteInfoContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider> {/* Wrap AppRoutes closely for metadata */}
      <WebsiteInfoProvider>
        <PagesProvider>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <AppRoutes />
            </ThemeProvider>
          </AuthProvider>
        </PagesProvider>
      </WebsiteInfoProvider>
    </HelmetProvider>
  </React.StrictMode>
);
