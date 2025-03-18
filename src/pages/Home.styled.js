// src/pages/Home.styled.js
import styled from "styled-components";

export const HomeContainer = styled.div`
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 3rem;
  font-family: ${(props) => props.theme.fonts.accent};
  color: ${(props) => props.theme.colors.accent};
  font-weight: 900;
  margin-bottom: 1rem;
`;

export const Description = styled.p`
  font-size: 1.2rem;
`;
