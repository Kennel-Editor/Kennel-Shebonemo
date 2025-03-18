import styled from "styled-components";

export const CarouselContainer = styled.div`
  min-height: 60vh;
`;

export const CarouselImageContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

export const CarouselImage = styled.img`
  max-width: 100%;
  max-height: 50vh;
  object-fit: contain;
`;

export const CarouselNav = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: ${(props) => props.theme.colors.white};
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 2rem;
  z-index: 1;

  &:first-child {
    left: 1px;
  }

  &:last-child {
    right: 1px;
  }
`;

export const PositionIndicator = styled.div`
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.white};

  span {
    font-size: 1rem;
    background-color: rgba(0, 0, 0, 0.6);
    padding: 0.3rem 0.5rem;
    border-radius: 5px;
  }
`;

export const CarouselCaptionContainer = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.colors.accent};
  color: ${(props) => props.theme.colors.text};
  padding: 10px;
  height: 10vh;
  overflow-y: auto;
  word-wrap: break-word;
  text-align: center;
  font-size: 1.2rem;
  border-radius: 0 0 8px 8px;
  z-index: 2;
  margin-bottom: 2rem;
`;
