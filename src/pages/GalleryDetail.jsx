import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { imageProps } from "../utils/sanityImage";
import SEO from "../components/SEO";
import LoadingSpinner from "../utils/LoadingSpinner";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "gallery" && _id == $id]{
          title,
          mainImage,
          mainImageCaption,
          images[]{
            asset, crop, hotspot,
            caption
          }
        }[0]`,
        { id }
      )
      .then((data) => {
        setGallery(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [id]);

  if (!gallery) return <p>Laster...</p>;
  if (loading) return <LoadingSpinner />;

  const allImages = [
    { ...gallery.mainImage, caption: gallery.mainImageCaption || "" },
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
            { ...gallery.mainImage, caption: "Hovedbilde" },
            ...gallery.images,
          ].map((img, index) => (
            <ImageItem key={index} onClick={() => handleImageClick(index)}>
              <Image {...imageProps(img, {width: 640, sizes: "(min-width: 768px) 25vw, 45vw"})} alt={img.caption || "Bilde"} />
            </ImageItem>
          ))}
        </GalleryGrid>
      </DetailContainer>
    </>
  );
};

export default GalleryDetail;
