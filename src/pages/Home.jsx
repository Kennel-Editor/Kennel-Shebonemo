import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { HomeContainer, Description, Title } from "./Home.styled";

const Home = () => {
  const [siteInfo, setSiteInfo] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteInfo"][0]{introText, pageTitle, introImage {asset->{url}}}`
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
    <HomeContainer>
      <Title>Velkommen til {siteInfo.pageTitle}</Title>

      <img
        src={siteInfo.introImage?.asset?.url}
        alt="Hero Image"
        className="col-10 col-md-8 col-lg-6 col-xl-4"
      />
      <Description className="col-10 col-md-8 col-lg-6 m-auto my-3">
        {siteInfo.introText}
      </Description>
    </HomeContainer>
  );
};

export default Home;