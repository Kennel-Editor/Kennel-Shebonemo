import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutContainer } from "./Layout.styled";
import { theme } from "../../styles/theme";

const Layout = ({ currentTheme, setCurrentTheme }) => {  // Endre til props
  return (
    <LayoutContainer
      style={{
        fontFamily: currentTheme?.fonts?.body || "sans-serif",  // Håndter tilfelle der fonts ikke er definert
        backgroundColor: currentTheme?.colors?.background || "#FFF", // Håndter tilfelle der bakgrunnsfarge ikke er definert
        color: currentTheme?.colors?.text || "#333",  // Håndter tilfelle der tekstfarge ikke er definert
      }}
    >
      <Header currentTheme={currentTheme} />
      
      <div>
        <h3>Velg Tema</h3>
        {Object.entries(theme).map(([key, themeVersion]) => (
          <button
            key={key}
            style={{
              margin: "5px",
              padding: "10px",
              borderRadius: "8px",
              backgroundColor: themeVersion.colors.accent,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontFamily: themeVersion.fonts.body,
            }}
            onClick={() => setCurrentTheme(themeVersion)} // Oppdaterer tema
          >
            {themeVersion.name}
          </button>
        ))}
      </div>
      
      <main>
        <Outlet />  {/* Bruk temaet i innholdet */}
      </main>

      <Footer currentTheme={currentTheme} />
    </LayoutContainer>
  );
};

export default Layout;
