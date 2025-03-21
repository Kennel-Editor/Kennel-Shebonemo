import styled from "styled-components";

export const DetailContainer = styled.section`
  margin: auto;
  .litters-list a {
    color: ${(props) => props.theme.colors.accent};
    text-decoration: none !important;
  }
`;

export const DogImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

export const DogName = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
`;

export const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const DogInfo = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  display: flex;
`;

export const HealthResults = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin:0:
  }
`;

export const HealthResultItem = styled.li`
  font-size: 1rem;
  line-height: 2.5;
`;

// Stamtavle-bildet (Pedigree)
export const PedigreeImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

// Fullskjermsvisning
export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  img {
    max-width: 90%;
    max-height: 90%;
    border-radius: 10px;
  }
`;
