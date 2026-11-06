import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import SEO from "../components/SEO";
import LoadingSpinner from "../utils/LoadingSpinner";
import { imageProps } from "../utils/sanityImage";
import {
  ContactContainer,
  Title,
  Paragraph,
  ContactInfo,
  ContactInfoContainer,
} from "./Contact.styled";

const Contact = () => {
  const [siteInfo, setSiteInfo] = useState(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteInfo"][0]{contactText,name, address, phoneNumber, email, extraInfo, contactImage}`
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
        title="Kontakt Kennel Shebonemo | Mona Fegri"
        description="Ta kontakt med Mona Fegri ved Kennel Shebonemo – tidligere kjent som Puddel Mona. Her finner du kontaktinformasjon, telefonnummer og e-post."
        keywords="kontakt kennel, Mona Fegri, Puddel Mona, Kennel Shebonemo, puddel oppdrett"
      />

      <ContactContainer className="col-10 col-lg-8 mx-auto text-center m-auto">
        <Title>Kontakt</Title>
        {siteInfo.contactText && (
          <Paragraph className="mb-5 ">{siteInfo.contactText}</Paragraph>
        )}

        <ContactInfoContainer className=" text-start text-sm-center col-10 m-auto">
          {siteInfo.name && (
            <ContactInfo className=" text-start text-sm-center ">
              Navn: {siteInfo.name}
            </ContactInfo>
          )}

          {siteInfo.address && (
            <ContactInfo className=" text-start text-sm-center ">
              📍 Adresse: {siteInfo.address}
            </ContactInfo>
          )}

          {siteInfo.phoneNumber && (
            <ContactInfo className=" text-start text-sm-center ">
              📞 Telefon: {siteInfo.phoneNumber}
            </ContactInfo>
          )}

          {siteInfo.email && (
            <ContactInfo className=" text-start text-sm-center ">
              📧 E-post: {siteInfo.email}
            </ContactInfo>
          )}

          {siteInfo.contactImage && (
            <img
              className="my-4 col-12 col-md-10 col-lg-8 m-auto"
              {...imageProps(siteInfo.contactImage, {width: 1200, sizes: "(min-width: 992px) 50vw, 95vw"})}
              alt="Kontaktbilde"
            />
          )}

          {siteInfo.extraInfo && (
            <ContactInfo className="col-12 col-sm-10 col-md-8 m-auto mt-2 text-start text-sm-center">
              {siteInfo.extraInfo}
            </ContactInfo>
          )}
        </ContactInfoContainer>
      </ContactContainer>
    </>
  );
};

export default Contact;
