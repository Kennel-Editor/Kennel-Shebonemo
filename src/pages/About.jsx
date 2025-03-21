import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import { AboutContainer, Title, Paragraph } from "./About.styled";

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
    <AboutContainer className="col-10 col-lg-8 m-auto">
      <Title>Om {siteInfo.pageTitle}</Title>
      {siteInfo.aboutTitle1 && <h2>{siteInfo.aboutTitle1}</h2>}
      {siteInfo.aboutText1 && <Paragraph>{siteInfo.aboutText1}</Paragraph>}

      {siteInfo.aboutTitle2 && <h2>{siteInfo.aboutTitle2}</h2>}
      {siteInfo.aboutText2 && <Paragraph>{siteInfo.aboutText2}</Paragraph>}
      {siteInfo.aboutImage && (
        <img
          src={urlFor(siteInfo.aboutImage)}
          alt="Kontaktbilde"
          style={{ maxWidth: "100%", borderRadius: "10px" }}
        />
      )}
      {siteInfo.aboutTitle3 && <h2>{siteInfo.aboutTitle3}</h2>}
      {siteInfo.aboutText3 && <Paragraph>{siteInfo.aboutText3}</Paragraph>}
    </AboutContainer>
  );
};

export default About;
