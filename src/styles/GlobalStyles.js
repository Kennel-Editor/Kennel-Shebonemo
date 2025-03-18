// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Playfair+Display:wght@400;700&family=Tangerine:wght@400;700&family=Parisienne&family=Pinyon+Script&family=Alex+Brush&display=swap');  :root {
    --primary-color: #3a3a3a; 
    --secondary-color: #f7f7f7; 
    --accent-color: #6a994e; 
    --header-font: 'Playfair Display', serif; 
    --text-font: 'Roboto', sans-serif; 
    --accent-font: "'Tangerine', cursive, sans-serif"
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
