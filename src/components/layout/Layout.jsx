import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutContainer } from "./Layout.styled";
import { theme } from "../../styles/theme";
import { FaHandPointer } from "react-icons/fa";

const Layout = ({ currentTheme, setCurrentTheme }) => {
  const [isThemeVisible, setIsThemeVisible] = useState(true); // Tilstand for å styre synlighet

  const toggleThemeVisibility = () => {
    setIsThemeVisible((prevState) => !prevState); // Toggle synlighet
  };

  return (
    <LayoutContainer
      style={{
        fontFamily: currentTheme?.fonts?.body || "sans-serif", // Håndter tilfelle der fonts ikke er definert
        backgroundColor: currentTheme?.colors?.background || "#FFF", // Håndter tilfelle der bakgrunnsfarge ikke er definert
        color: currentTheme?.colors?.text || "#333", // Håndter tilfelle der tekstfarge ikke er definert
      }}
    >
      <Header currentTheme={currentTheme} />

      <button
        style={{
          margin: "10px",
          padding: "10px",
          borderRadius: "8px",
          backgroundColor: currentTheme?.colors?.accent || "#D6A7E3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
        className="col-4 col-md-3 col-lg-2 ms-3 mb-3"
        onClick={toggleThemeVisibility}
      >
        <FaHandPointer className="me-2 mb-1" />
        {isThemeVisible ? "Skjul Temaer" : "Vis Temaer"}{" "}
        {/* Skifter tekst på knappen */}
      </button>

      {isThemeVisible && (
        <div className="col-10 m-auto border mb-4">
          <h3 className="text-center">Velg Tema</h3>
          <p className="text-center">
            bruk litt tid på å finne farger og skrifttyper du liker. Kombiner
            gjerne fra forskjellige temaer <br /> kan også velge andre
            skrifttyper om du ønsker!
          </p>
          {Object.entries(theme).map(([key, themeVersion]) => (
            <button
              key={key}
              style={{
                margin: "5px",
                padding: "5px",
                borderRadius: "8px",
                backgroundColor: themeVersion.colors.accent,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontFamily: themeVersion.fonts.heading,
              }}
              onClick={() => setCurrentTheme(themeVersion)} // Oppdaterer tema
            >
              {themeVersion.name}
            </button>
          ))}
        </div>
      )}

      <main>
        <Outlet /> {/* Bruk temaet i innholdet */}
      </main>

      <Footer currentTheme={currentTheme} />
    </LayoutContainer>
  );
};

export default Layout;
