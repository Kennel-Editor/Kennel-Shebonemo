import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import SEO from "../components/SEO";
import {
  DetailContainer,
  GalleryGrid,
  ImageItem,
  Image,
  Title,
} from "./GalleryDetail.styled";
import Carousel from "../components/Carousel";

const GalleryDetail = () => {
  const { id } = useParams();
  const [gallery, setGallery] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "gallery" && _id == $id]{
          title,
          "mainImageUrl": mainImage.asset->url,
          mainImageCaption,
          images[]{
            "imageUrl": asset->url,
            caption
          }
        }[0]`,
        { id }
      )
      .then((data) => setGallery(data))
      .catch(console.error);
  }, [id]);

  if (!gallery) return <p>Laster...</p>;

  const allImages = [
    { imageUrl: gallery.mainImageUrl, caption: gallery.mainImageCaption || "" },
    ...gallery.images,
  ];
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);

    const carouselElement = document.getElementById("title");
    if (carouselElement) {
      carouselElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
     <SEO
        title={`${gallery.title} | Bildegalleri – Kennel Shebonemo`}
        description={`Se bilder fra ${gallery.title} hos Kennel Shebonemo, tidligere kjent som Puddel Mona. Oppdrett av storpudler i Norge.`}
        keywords={`bildegalleri, puddelbilder, ${gallery.title}, Mona Fegri, Puddel Mona, storpuddel, kennel shebonemo`}
      />
    <DetailContainer>
      <Title id="title">{gallery.title}</Title>

      <Carousel
        images={allImages}
        currentIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
      />

      <GalleryGrid className="col-12 col-sm-10 col-lg-8 m-auto">
        {[
          { imageUrl: gallery.mainImageUrl, caption: "Hovedbilde" },
          ...gallery.images,
        ].map((img, index) => (
          <ImageItem key={index} onClick={() => handleImageClick(index)}>
            <Image src={img.imageUrl} alt={img.caption || "Bilde"} />
          </ImageItem>
        ))}
      </GalleryGrid>
    </DetailContainer>
    </>
  );
};

export default GalleryDetail;
