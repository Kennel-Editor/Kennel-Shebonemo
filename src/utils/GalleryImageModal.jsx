import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import {
  ModalOverlay,
  NavigationButton,
  Counter,
  ModalContent,
  CloseButton,
  ModalContainer,
} from "./Modals.styled";
import { imageProps, videoUrlFor } from "./sanityImage";

const GalleryImageModal = ({
  mediaItems,
  currentMediaIndex,
  onClose,
  onPrev,
  onNext,
}) => {
  const currentMedia = mediaItems[currentMediaIndex];
  const videoUrl =
    currentMedia.type === "video" ? videoUrlFor(currentMedia.url) : null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* Close button inside the relative div */}
            <CloseButton onClick={onClose}>×</CloseButton>

            {currentMedia.type === "image" ? (
              <img
                {...imageProps(currentMedia.asset, {width: 1920, sizes: "80vw", lazy: false})}
                alt={`Gallery image ${currentMediaIndex + 1}`}
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                  objectFit: "contain",
                }}
              />
            ) : (
              <video
                key={videoUrl}
                src={videoUrl}
                preload="metadata"
                controls
                playsInline
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                }}
              >
                Your browser does not support the video tag.
              </video>
            )}

            <Counter>
              {currentMediaIndex + 1} / {mediaItems.length}
            </Counter>

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
          </div>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default GalleryImageModal;
