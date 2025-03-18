// src/components/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutContainer } from "./Layout.styled";
import DynamicBreadcrumbs from "../Breadcrumbs";

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <DynamicBreadcrumbs />
      <main> <Outlet /></main>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
