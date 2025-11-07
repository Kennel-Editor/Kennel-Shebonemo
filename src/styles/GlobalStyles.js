import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&family=Allura&display:wght@400;600&family=Merriweather:wght@400;700&family=Great+Vibes&family=Poppins:wght@400;700&family=Lora:wght@400;700&family=Dancing+Script&family=Nunito:wght@400;700&family=Bitter:wght@400;700&family=Pacifico&family=Raleway:wght@400;600&family=Playfair+Display:wght@400;700&family=Pinyon+Script&family=Muli&family=Roboto+Slab:wght@400;700&family=Alex+Brush&family=Lato:wght@400;700&family=EB+Garamond&family=Parisienne&family=Birthstone&family=Estonia&family=Island+Moments&family=Cabin:wght@400;700&family=Quicksand:wght@400;700&family=Oswald:wght@400;700&family=Vollkorn:wght@400;700&family=Marck+Script&family=Herr+Von+Muellerhoff&family=Euphoria+Script&family=Bad+Script&display=swap');
    
root:
*{
  background: ${(props) => props.theme.colors.background};
}
  body {
    font-family: ${(props) => props.theme?.fonts?.body || "sans-serif"}; 
    color: ${(props) => props.theme?.colors?.text || "#333"};
    background: ${(props) => props.theme.colors.background};
    padding: 0;
     margin: 0;
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

    img:not(.hero-image, .gallery-image, .no-theme) {
    border-radius: ${(props) => props.theme?.imageStyles?.borderRadius || "0"};
    border: ${(props) => props.theme?.imageStyles?.border || "none"};
    box-shadow: ${(props) => props.theme?.imageStyles?.boxShadow || "none"};
    object-fit: cover;
  }
`;
