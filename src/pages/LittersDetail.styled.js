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

    border-top: 1px solid ${(props) => props.theme.colors.accent};
    padding: 20px 0px;
  }
`;

export const ParentInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  h3 {
    font-size: 1.5rem;
    
  }
  .title-text {
    height: 1.5rem;
    font-size: 1rem;
    marign: 0px;
    padding: 0px;
    font-weight: 600;
     @media (max-width: 667px){
      min-height: 2.5rem;
     }
    @media (max-width: 400px) {
      font-size: 0.8rem;
      min-height: 2rem;
    }
       @media (min-width: 1280){
       
       }
  }
  .litter-name {
    min-height: 3.5rem;
    marign: 0px;
    padding: 0px 0px 0px 10px;
    

    @media (max-width: 400px) {
      min-height: 1rem;
      font-size: 1.1rem;
    }
      
    @media (max-width: 880px) {
      font-size: 1.4rem;
    }
  }
  }
`;

export const ParentInfo = styled.div`
  margin-bottom: 2rem;
  padding: 0.1rem;
`;

export const ParentImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 10px;
  object-fit: contain;
  object-position: center;
  min-height: 200px;
  max-height: 500px;
  aspect-ratio: 1 / 1;
`;

export const PuppiesContainer = styled.div`
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
    cursor: pointer;
  }
`;

export const MainImgContainer = styled.div`
  display: flex;
  margin: auto;
  justify-content: center;
  img {
    width: 100%;

    height: auto;
    border-radius: 8px;
    object-fit: contain;
  }
`;
