import styled, { keyframes } from "styled-components";
import { FaPaw } from "react-icons/fa";

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const rotatePaw = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
`;

export const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${(props) => props.height || "50vh"};
  flex-direction: column;
  text-align: center;
`;

export const PawsSpinner = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border: 8px solid ${(props) => props.theme.colors.accent};
  border-top: 8px solid ${(props) => props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 2rem;
    color: ${(props) => props.theme.colors.accent};
    animation: ${rotatePaw} 2s infinite linear;
  }
`;

export const TimeoutMessage = styled.p`
  margin-top: 20px;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.text};
`;

export const RetryButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.text};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }
`;

export const MiniPaw = styled(FaPaw)`
  animation: ${rotatePaw} 0.8s linear infinite;
  font-size: ${(props) => props.size || "1rem"};
  color: ${(props) => props.color || props.theme.colors.accent};
  display: inline-block;
  vertical-align: middle;
`;