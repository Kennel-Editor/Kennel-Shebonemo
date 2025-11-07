import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { HomeContainer, Description, Title } from "./Home.styled";
import SEO from "../components/SEO";
import LoadingSpinner from "../utils/LoadingSpinner";

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
    return <LoadingSpinner />;
  }

  return (
    <>
      <SEO
        title="Kennel Shebonemo – Puddel Mona | Storpuddel-oppdrett i Oslo"
        description="Kennel Shebonemo, tidligere kjent som Puddel Mona, driver oppdrett av storpudler med fokus på helse og kvalitet. Se våre hunder og valpekull."
        keywords="puddel mona, puddelmona, kennel shebonemo, storpudler, valper, oppdretter Oslo, Mona Fegri"
      />
      <HomeContainer>
        <Title className="col-10 m-auto mb-3">
          Velkommen til
          <span className="d-none d-md-inline"> </span>
          <br className="d-md-none" />
          {siteInfo.pageTitle}
        </Title>

        <img
          src={siteInfo.introImage?.asset?.url}
          alt="Hero Image"
          className="col-10 col-sm-8 col-md-6 col-lg-5 col-xl-4"
        />
        <Description className="col-10 col-md-8 col-lg-6 m-auto my-3">
          {siteInfo.introText}
        </Description>
      </HomeContainer>
    </>
  );
};

export default Home;
