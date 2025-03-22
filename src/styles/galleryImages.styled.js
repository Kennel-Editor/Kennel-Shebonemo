import styled from "styled-components";
export const GalleryContainer = styled.div`
  margin-top: 2rem;
  text-align: center;

  h4 {
    margin-bottom: 1rem;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }
`;

export const GalleryImage = styled.img`
  max-width: 150px;
  height: auto;
  with: 100%;
  max-height: 150px;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.2s ease;
  object-fit: contain;

  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 500px) {
    max-width: 45%;
    gap: 0px;
  }
`;
