import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./styles/GlobalStyles";
import sanityClient from "./sanityClient";
import { getTheme } from "./styles/theme";
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
import useSiteSettings from "./hooks/useSiteSettings";
import PageSkeleton from "./components/skeletons/PageSkeleton";
import Admin from "./pages/Admin";
import TrackAllRoutes from "./counter/TrackAllRoutes";

const App = () => {
  const settings = useSiteSettings();
  const [theme, setTheme] = useState(getTheme());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(`*[_type == "siteSettings" && isActive == true][0]`)
      .then((data) => {
        setTheme(getTheme(data));
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Feil ved henting av tema:", err);
        setTheme(getTheme());
        setIsLoading(false);
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <TrackAllRoutes />
        {isLoading ? (
          <PageSkeleton />
        ) : (
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="dogs" element={<OurDogs />} />
              <Route path="dogs/:id" element={<DogDetail />} />
              <Route path="litters" element={<Litters />} />
              <Route path="litters/:id" element={<LittersDetail />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="gallery/:id" element={<GalleryDetail />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        )}
      </Router>
    </ThemeProvider>
  );
};

export default App;
