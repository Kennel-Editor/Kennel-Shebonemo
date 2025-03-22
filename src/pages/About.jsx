import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import { AboutContainer, Title, Paragraph, SectionTitle } from "./About.styled";

const About = () => {
  const [siteInfo, setSiteInfo] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteInfo"][0]{pageTitle,aboutTitle1, aboutText1, aboutTitle2, aboutText2, aboutTitle3, aboutText3, aboutImage}`
      )
      .then((data) => {
        setSiteInfo(data);
      })
      .catch(console.error);
  }, []);

  if (!siteInfo) {
    return <div>Loading...</div>;
  }

  return (
    <AboutContainer className="col-12 col-sm-10 col-md-8 col-lg-6 m-auto mt-3">
      <Title>Om {siteInfo.pageTitle}</Title>
      {siteInfo.aboutTitle1 && (
        <SectionTitle>{siteInfo.aboutTitle1}</SectionTitle>
      )}
      {siteInfo.aboutText1 && <Paragraph>{siteInfo.aboutText1}</Paragraph>}

      {siteInfo.aboutTitle2 && (
        <SectionTitle>{siteInfo.aboutTitle2}</SectionTitle>
      )}
      {siteInfo.aboutText2 && <Paragraph>{siteInfo.aboutText2}</Paragraph>}
      {siteInfo.aboutImage && (
        <img src={urlFor(siteInfo.aboutImage)} alt="Kontaktbilde" />
      )}
      {siteInfo.aboutTitle3 && (
        <SectionTitle>{siteInfo.aboutTitle3}</SectionTitle>
      )}
      {siteInfo.aboutText3 && <Paragraph>{siteInfo.aboutText3}</Paragraph>}
    </AboutContainer>
  );
};

export default About;
