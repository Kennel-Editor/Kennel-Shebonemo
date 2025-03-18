import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  ModalOverlay,
  NavigationButton,
  Counter,
  ModalContent,
  CloseButton,
} from "./Modals.styled";

const GalleryImageModal = ({
  images,
  currentImageIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>

        {/* Image Display */}
        <img
          src={images[currentImageIndex]}
          alt={`Gallery image ${currentImageIndex + 1}`}
          style={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            minWidth: "60vw",
            minHeight: "60vh",
            objectFit: "contain",
          }}
        />

        {/* Navigation Arrows */}
        <NavigationButton direction="left" onClick={onPrev}>
          <FaAngleLeft />
        </NavigationButton>
        <NavigationButton direction="right" onClick={onNext}>
          <FaAngleRight />
        </NavigationButton>

        {/* Image Counter */}
        <Counter>
          {currentImageIndex + 1} / {images.length}
        </Counter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default GalleryImageModal;
