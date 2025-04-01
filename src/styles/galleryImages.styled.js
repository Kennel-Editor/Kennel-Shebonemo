import styled from "styled-components";

export const GalleryContainer = styled.div`
  margin-top: 2rem;
  text-align: center;

  h4 {
    margin-bottom: 1rem;
  }
`;

export const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  justify-items: center;
`;

export const GalleryImage = styled.img`
  width: 100%;
  max-width: 150px;
  height: auto;
  max-height: 100px;
  border-radius: 10px;
  cursor: pointer;
  object-position: 50% 30%;
  transition: transform 0.2s ease;
  overflow: hidden;
  object-fit: cover;

  &:hover {
    transform: scale(1.05);
  }
`;

export const VideoThumbnail = styled.div`
  position: relative;
  width: 100%;
  max-width: 150px;
  height: auto;
  max-height: 100px;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
    color: white;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    padding: 10px;
  }
`;

export const VideoContainer = styled.div`
  margin: 0 auto;

  video {
    width: 100%;
    max-height: 40vh;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: block;
  }
`;
