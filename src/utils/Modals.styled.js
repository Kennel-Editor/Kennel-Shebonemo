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

export const ModalContent = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.white};
  font-size: 24px;
  cursor: pointer;
`;

export const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  ${(props) => (props.direction === "left" ? "left: 10px;" : "right: 10px;")}
  background: transparent;
  border: none;
  color: ${(props) => props.theme.colors.white};
  font-size: 30px;
  cursor: pointer;
  transform: translateY(-50%);
  svg {
    filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 1));
  }
`;

export const Counter = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: ${(props) => props.theme.colors.primary};

  font-size: 16px;
  background-color: ${(props) => props.theme.colors.accentTransparent};
  padding: 5px 15px;
  border-radius: 25px;
`;
