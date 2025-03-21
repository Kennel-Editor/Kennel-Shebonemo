import React, { useEffect, useState } from "react";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
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
    return <div>Loading...</div>;
  }

  return (
    <ContactContainer className="col-10 col-lg-8 mx-auto">
      <Title>Kontakt</Title>
      <Paragraph className="mb-5">{siteInfo.contactText}</Paragraph>
      <ContactInfoContainer className="mb-5">
        <ContactInfo>Navn: {siteInfo.name}</ContactInfo>
        <ContactInfo>📍 Adresse: {siteInfo.address}</ContactInfo>
        <ContactInfo>📞 Telefon: {siteInfo.phoneNumber}</ContactInfo>
        <ContactInfo>📧 E-post: {siteInfo.email}</ContactInfo>
        {siteInfo.contactImage && (
          <img
            className="my-4"
            src={urlFor(siteInfo.contactImage)}
            alt="Kontaktbilde"
            style={{ maxWidth: "100%", borderRadius: "10px" }}
          />
        )}

        {siteInfo.extraInfo && <ContactInfo>{siteInfo.extraInfo}</ContactInfo>}
      </ContactInfoContainer>
    </ContactContainer>
  );
};

export default Contact;
