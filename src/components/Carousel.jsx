import { imageProps } from "../utils/sanityImage";
import React from "react";
import {
  CarouselImageContainer,
  CarouselImage,
  CarouselNav,
  PositionIndicator,
  CarouselCaptionContainer,
  CarouselContainer,
} from "./Carousel.styled";

const Carousel = ({ images, currentIndex, setCurrentImageIndex }) => {
  const image = images[currentIndex];
  const { caption } = image;

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <CarouselContainer>
      <CarouselImageContainer className="col-lg-10 col-xl-8 col-xxl-6 mx-auto">
        <CarouselNav onClick={prevImage}>❮</CarouselNav>

        <CarouselImage className="gallery-image" {...imageProps(image, {width: 1920, sizes: "(min-width: 992px) 65vw, 95vw", lazy: false})} alt={caption} />

        <PositionIndicator>
          <span>
            {currentIndex + 1}/{images.length}
          </span>
        </PositionIndicator>

        <CarouselNav onClick={nextImage}>❯</CarouselNav>
      </CarouselImageContainer>

      <CarouselCaptionContainer className="col-lg-10 col-xl-8 col-xxl-6 mx-auto">
        <p className="col-lg-8 m-auto">{caption}</p>
      </CarouselCaptionContainer>
    </CarouselContainer>
  );
};
export default Carousel;
