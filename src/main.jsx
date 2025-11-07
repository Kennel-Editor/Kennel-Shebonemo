import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App.jsx";
import { getTheme } from "./styles/theme.js";
import { GlobalStyles } from "./styles/GlobalStyles.js";
import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider theme={getTheme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
