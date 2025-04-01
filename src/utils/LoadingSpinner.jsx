import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaRedoAlt } from "react-icons/fa";
import { FaPaw } from "react-icons/fa";

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${(props) => props.height || "50vh"};
  flex-direction: column;
  text-align: center;
`;

const PawsSpinner = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border: 8px solid ${(props) => props.theme.colors.accent};
  border-top: 8px solid ${(props) => props.theme.colors.primary}; /* Hvit topplinje for "effekt" */
  border-radius: 50%;
  animation: spin 2s linear infinite;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    font-size: 2rem; /* Pote-ikonet størrelse */
    color: ${(props) => props.theme.colors.accent};
    animation: rotatePaw 2s infinite linear;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes rotatePaw {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
`;

const TimeoutMessage = styled.p`
  margin-top: 20px;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.text};
`;

const RetryButton = styled.button`
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

const LoadingSpinner = ({ height = "50vh", timeout = 5000 }) => {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimedOut(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <SpinnerContainer height={height}>
      {/* Legge til FaPaw-ikonet her */}
      <PawsSpinner>
        <FaPaw />
      </PawsSpinner>
      {isTimedOut && (
        <>
          <TimeoutMessage>
            Vi har hatt problemer med å laste inn dataene.
          </TimeoutMessage>
          <RetryButton onClick={reloadPage}>
            <FaRedoAlt style={{ marginRight: "8px" }} />
            Prøv å laste siden på nytt
          </RetryButton>
        </>
      )}
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
