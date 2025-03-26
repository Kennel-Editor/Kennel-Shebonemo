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
      <ModalContent>
        <div
          style={{ position: "relative" }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose}>×</CloseButton>

          {/* Image Display */}
          <img
            src={images[currentImageIndex]}
            alt={`Gallery image ${currentImageIndex + 1}`}
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              minWidth: "60vw",
              minHeight: "60vh",
              objectFit: "contain",
            }}
          />

          <Counter>
            {currentImageIndex + 1} / {images.length}
          </Counter>
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
      </ModalContent>
    </ModalOverlay>
  );
};

export default GalleryImageModal;
