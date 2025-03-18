// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Playfair+Display:wght@400;700&family=Great+Vibes&family=Montserrat:wght@400;600&family=Merriweather:wght@400;700&display=swap'); 
  :root {
    --primary-color: #4B2D6A;  /* Mørk lilla */
--secondary-color: #f7f7f7; 
    --accent-color: #D6A7E3;    /* Lilla aksentfarge */
    --header-font: 'Merriweather', serif; /* Endret til Merriweather for overskrifter */
    --text-font: 'Montserrat', sans-serif; /* Endret til Montserrat for body */
    --accent-font: 'Great Vibes', cursive; /* Great Vibes for accent */
  }
  body {
    font-family: var(--text-font);
    color: var(--primary-color);
    background-color: var(--secondary-color);
    margin: 0;
    padding: 0;
    height: 100vh;
  }

  h1, h2, h3 {
    font-family: var(--header-font);
  }

  a {
    text-decoration: none; 
  }

  p, h1, h2, h3, li, span, div {
    white-space: pre-line;
  }

`;
