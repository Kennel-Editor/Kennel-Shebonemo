import React, { useState, useEffect } from "react";
import { FooterContainer } from "./Footer.styled";
import sanityClient from "../../sanityClient";

const Footer = ({ currentTheme }) => {
  const [pageTitle, setpageTitle] = useState("");

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteInfo"][0]{
          pageTitle
        }`
      )
      .then((data) => {
        if (data && data.pageTitle) {
          setpageTitle(data.pageTitle);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <FooterContainer>
      <p>© {pageTitle} - ALL RIGHTS RESERVED</p>
      <p className="made-by">
        Nettside laget av Kristine Tyrholm <br />
        kennel.editor@gmail.com
      </p>
    </FooterContainer>
  );
};

export default Footer;
