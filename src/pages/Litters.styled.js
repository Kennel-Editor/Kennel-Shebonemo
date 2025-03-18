import styled from "styled-components";

export const LitterContainer = styled.div`
  margin: auto;

  h2 {
    font-size: 3rem;
    font-family: ${(props) => props.theme.fonts.accent};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 900;
  }
  .costum-border {
    border-bottom: 1px solid ${(props) => props.theme.colors.accent};
  }
`;

export const LitterCard = styled.div`
  background: ${(props) => props.theme.colors.white};
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  box-shadow: ${(props) => props.theme.shadows.boxShadow};
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 50%;
    height: 15rem;
    object-fit: cover;
    object-position: center;

    &:first-child {
      object-position: right;
    }

    &:last-child {
      object-position: left;
    }
    @media (max-width: 400px) {
      height: 12rem;
    }
  }

  h3 {
    margin: 10px 0 5px;
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.accent};
    min-height: 60px;
  }

  p {
    margin: 5px 0;
    font-size: 1.2rem;
    color: ${(props) => props.theme.colors.secondary};
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
