import styled from "styled-components";

export const DetailContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: ${(props) => props.theme.colors.background};
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-family: ${(props) => props.theme.fonts.accent};
  color: ${(props) => props.theme.colors.accent};
  font-weight: 900;
`;

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  }
`;

export const ImageItem = styled.div`
  position: relative;
  text-align: center;
`;

export const Image = styled.img`
  width: 100%;
  max-width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  object-position: 50% 30%;
   aspect-ratio: 1 / 1;
`;

export const CaptionContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: ${(props) => props.theme.colors.white};
  padding: 0.5rem;
  text-align: center;
  border-radius: 0 0 8px 8px;
`;

export const Caption = styled.p`
  font-size: 1rem;
  margin: 0;
  color: ${(props) => props.theme.colors.white};
`;
