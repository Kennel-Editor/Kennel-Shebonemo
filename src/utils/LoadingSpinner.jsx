import React, { useState, useEffect } from "react";
import { FaRedoAlt } from "react-icons/fa";
import { FaPaw } from "react-icons/fa";
import {
  SpinnerContainer,
  PawsSpinner,
  MiniPaw,
  RetryButton,
  TimeoutMessage,
} from "./LoadingSpinner.styled";

export function MiniPawSpinner(props) {
  return <MiniPaw {...props} />;
}

const LoadingSpinner = ({ height = "50vh", timeout = 5000 }) => {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsTimedOut(true), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <SpinnerContainer height={height}>
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
