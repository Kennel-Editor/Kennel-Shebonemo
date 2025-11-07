import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import SEO from "../components/SEO";
import LoadingSpinner from "../utils/LoadingSpinner";
import {
  GalleryContainer,
  GalleryGrid,
  GalleryItem,
  Image,
  Title,
} from "./Gallery.styled";
import sanityClient from "../sanityClient";

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "gallery"]{
          _id,
          title,
          "mainImageUrl": mainImage.asset->url
        }`
      )
      .then((data) => {
        setGalleries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEO
        title="Bildegalleri | Kennel Shebonemo"
        description="Se bilder fra tidligere valpekull, hunder og øyeblikk hos Kennel Shebonemo – tidligere kjent som Puddel Mona."
        keywords="hundebilder, puddelgalleri, storpuddel, valpekull, Puddel Mona, Kennel Shebonemo, Mona Fegri"
      />
      <GalleryContainer className="container col-lg-10 mx-auto">
        <h1>Gallerier</h1>
        <div className="row g-4">
          {galleries.length > 0 ? (
            galleries.map((gallery) => (
              <div
                key={gallery._id}
                className="col-12 col-sm-8 col-md-6 col-xl-4 mx-auto"
              >
                <NavLink to={`/gallery/${gallery._id}`}>
                  <GalleryItem>
                    <Image src={gallery.mainImageUrl} alt={gallery.title} />
                    <Title>{gallery.title}</Title>
                  </GalleryItem>
                </NavLink>
              </div>
            ))
          ) : (
            <p>Ingen gallerier tilgjengelig.</p>
          )}
        </div>
      </GalleryContainer>
    </>
  );
};

export default Gallery;
