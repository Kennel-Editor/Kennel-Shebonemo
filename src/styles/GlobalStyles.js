import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Playfair+Display:wght@400;700&family=Great+Vibes&family=Montserrat:wght@400;600&family=Merriweather:wght@400;700&family=Poppins:wght@400;700&family=Lora:wght@400;700&family=Nunito:wght@400;700&family=Bitter:wght@400;700&family=Open+Sans:wght@400;600&family=Raleway:wght@400;600&family=Arvo:wght@400;700&family=Pacifico&family=Alex+Brush&family=Dancing+Script&family=EB+Garamond&family=Parisienne&family=Pinyon+Script&family=Muli&family=Corinthia&family=Birthstone&family=Estonia&family=MonteCarlo&family=Bonheur+Royale&family=Island+Moments&family=Playball&family=Roboto+Slab:wght@400;700&family=Quicksand:wght@400;500;700&family=Bad+Script&display=swap');
  
root:
  body {
    font-family: ${(props) => props.theme?.fonts?.body || "sans-serif"}; 
    color: ${(props) => props.theme?.colors?.text || "#333"};
    background-color: ${(props) => props.theme?.colors?.background || "#FFF"};
    margin: 0;
    padding: 0;
    height: 100vh; 
  }

  h1, h2, h3 {
    font-family: ${(props) => props.theme?.fonts?.heading || "serif"}; 
  }

  a {
    text-decoration: none;
  }

  p, h1, h2, h3, li, span, div {
    white-space: pre-line;
  }
`;
