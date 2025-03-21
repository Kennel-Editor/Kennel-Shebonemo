// src/App.jsx
import React from "react";
import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import { theme } from "./styles/theme";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import OurDogs from "./pages/OurDogs";
import DogDetail from "./pages/DogDetail";
import Litters from "./pages/Litters";
import LittersDetail from "./pages/LittersDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Gallery from "./pages/Gallery";
import GalleryDetail from "./pages/GalleryDetail";

const App = () => {
  // Starter med første tema som default
  const [currentTheme, setCurrentTheme] = useState(theme.version4);

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                currentTheme={currentTheme}
                setCurrentTheme={setCurrentTheme}
              />
            }
          >
            <Route index element={<Home />} />
            <Route path="dogs" element={<OurDogs />} />
            <Route path="dogs/:id" element={<DogDetail />} />
            <Route path="litters" element={<Litters />} />
            <Route path="litters/:id" element={<LittersDetail />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="gallery/:id" element={<GalleryDetail />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
