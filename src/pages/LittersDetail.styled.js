import styled from "styled-components";

export const LitterContainer = styled.div`
  margin: auto;
  h2 {
    font-size: 3rem;
    font-family: ${(props) => props.theme.fonts.accent};
    color: ${(props) => props.theme.colors.accent};
    font-weight: 900;
    margin-bottom: 1rem;
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
    margin-bottom:2px
    
  }
  .title-text {
    font-size: 1rem;
    margin: 5px 0px ;
    padding: 0px;
    font-weight: 600;
     @media (max-width: 667px){
   
     }
    @media (max-width: 400px) {
      font-size: 0.8rem;
      }
      .title-text:empty {
  display: none;  
}
     
  }
  .litter-name {
    margin: 0px;
    padding: 0px 0px 10px 0px;
    

    @media (max-width: 400px) {
 
      font-size: 1.1rem;
    }
      
    @media (max-width: 880px) {
      font-size: 1.4rem;
    }
  }
  }
`;

export const ParentImage = styled.img`
  width: 100%;
  height: auto;
  max-width: 100%;
  border-radius: 10px;
  object-fit: cover;
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
