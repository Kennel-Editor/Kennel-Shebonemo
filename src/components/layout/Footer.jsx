// src/components/Footer.jsx
import React from "react";
import { FooterContainer } from "./Footer.styled";

const Footer = () => {
  return (
    <FooterContainer>
      <p>© Kennel Shirkus - ALL RIGHTS RESERVED</p>
      <p className="made-by">Nettside laget av Kristine Tyrholm</p>
    </FooterContainer>
  );
};

export default Footer;
