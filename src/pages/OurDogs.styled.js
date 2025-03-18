import styled from "styled-components";

export const DogsContainer = styled.div`
  h2 {
    font-size: 3rem;
    font-family: ${(props) => props.theme.fonts.accent};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 900;
  }
  .costum-border {
    border-bottom: 1px solid ${(props) => props.theme.colors.accent};
    padding: 20px 0;
  }
`;

export const DogsGrid = styled.section`
  display: grid;
  gap: 1rem;
  padding: 2rem;
`;

export const DogCard = styled.div`
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
    width: 100%;
    height: 50vh;
    object-fit: cover;
    object-position: center;
    object-position: 40% 15%;
  }

  h3 {
    margin: 10px 0 5px;
    font-size: 1.5rem;
    color: ${(props) => props.theme.colors.text};
  }

  h4 {
    margin-bottom: 15px;
    font-size: 1rem;
    color: ${(props) => props.theme.colors.secondary};
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;
