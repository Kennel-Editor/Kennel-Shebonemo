import React from "react";
import { CloseButton, ModalOverlay, ModalContent } from "./Modals.styled";

const Modal = ({ imageUrl, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent>
        <div 
          style={{ position: "relative" }} 
          onClick={(e) => e.stopPropagation()} 
        >
          <CloseButton onClick={onClose}>×</CloseButton>

          <img
            className="gallery-image"
            src={imageUrl}
            alt="Vis bilde"
            style={{
              maxWidth: "90vw",
              maxHeight: "90vh",
              minWidth: "60vw",
              minHeight: "60vh",
              widt: "auto",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;
