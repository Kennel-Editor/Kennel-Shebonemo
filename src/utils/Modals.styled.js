import React from "react";
import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: -60px;
  right: 0px;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.white};
  font-size: 3rem;
  cursor: pointer;
  text-shadow: 0px 1px 5px rgba(0, 0, 0, 0.9);
`;

export const NavigationButton = styled.button`
  position: fixed;
  top: 50%;
  left: ${({ direction }) => (direction === "left" ? "0" : "auto")};
  right: ${({ direction }) => (direction === "right" ? "0" : "auto")};
  background: transparent;
  padding: 2rem;
  border: none;
  color: ${(props) => props.theme.colors.white};
  font-size: 3rem;
  cursor: pointer;
  transform: translateY(-50%);
  z-index: 1001;
  @media (min-width: 1100px) {
    left: ${({ direction }) => (direction === "left" ? "5vw" : "auto")};
    right: ${({ direction }) => (direction === "right" ? "5vw" : "auto")};
  }
  svg {
    filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 1));
  }
`;

export const Counter = styled.div`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  background-color: ${(props) => props.theme.colors.accentTransparent};
  padding: 5px 15px;
  border-radius: 25px;
`;
