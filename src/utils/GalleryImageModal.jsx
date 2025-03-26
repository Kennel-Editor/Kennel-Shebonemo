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
      {/* Dette onClick stopper bare klikk inne i bildet */}
      <ModalContent>
        <div
          style={{ position: "relative" }}
          onClick={(e) => e.stopPropagation()} /* Stopper kun klikk på bildet */
        >
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
        </div>

        {/* Navigation Arrows */}
        <NavigationButton
          direction="left"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
        >
          <FaAngleLeft />
        </NavigationButton>
        <NavigationButton
          direction="right"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
        >
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
