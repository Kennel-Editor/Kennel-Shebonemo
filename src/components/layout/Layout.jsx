// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutContainer } from "./Layout.styled";
import { theme } from "../../styles/theme";

const Layout = ({ setCurrentTheme }) => {
  return (
    <LayoutContainer>
      <Header />
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <h3>Velg Tema</h3>
        {Object.entries(theme).map(([key, theme]) => (
          <button
            key={key}
            style={{
              margin: "5px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: theme.colors.accent,
              color: "#fff",
              border: "none", 
              cursor: "pointer",
              fontFamily: theme.fonts.body,
            }}
            onClick={() => setCurrentTheme(theme)}
          >
            {theme.name}
          </button>
        ))}
      </div>
      <main>
        <Outlet />
      </main>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
