// src/components/Footer.styled.js
import styled from "styled-components";

export const FooterContainer = styled.footer`
  background-color: ${(props) => props.theme.colors.accent};
  color: white;
  padding: 1rem;
  text-align: center;
  margin-top: 20px;
  .made-by {
    font-size: 0.8rem;
  }
`;
