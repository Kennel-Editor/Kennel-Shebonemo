// styles/theme.js
import HeroImage1 from "../assets/images/background-beige.jpg";
import HeroImage2 from "../assets/images/background-pink.jpg";
import HeroImage3 from "../assets/images/background-pastelle.jpg";
import HeroImage4 from "../assets/images/background-pink&purple.jpg";
import HeroImage5 from "../assets/images/background-blue.jpg";
import HeroImage6 from "../assets/images/background-dogs-pink.jpeg";
import HeroImage7 from "../assets/images/background-red.jpg";
import HeroImage8 from "../assets/images/background-orange.jpg";

export const theme = {
  version1: {
    name: "Elegant Lilla",
    colors: {
      primary: "#4B2D6A",
      secondary: "#F4E1D2",
      accent: "#D6A7E3",
      accentTransparent: "rgba(214, 167, 227, 0.8)",
      white: "#FFFFFF",
      background: "#F8F8F8",
      text: "#4A4A4A",
      title: "#E67E22",
    },
    fonts: {
      body: "Montserrat, sans-serif",
      heading: "Merriweather, serif",
      accent: "'Great Vibes', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage1,
  },

  version2: {
    name: "Romantisk Rose",
    colors: {
      primary: "#8B3A62",
      secondary: "#FBE3E8",
      accent: "#D881A4",
      accentTransparent: "rgba(216, 129, 164, 0.8)",
      white: "#FFFFFF",
      background: "#F9F9F9",
      text: "#4E4E4E",
      title: "#D44E79",
    },
    fonts: {
      body: "Poppins, sans-serif",
      heading: "Lora, serif",
      accent: "'Dancing Script', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage2,
  },

  version3: {
    name: "Moderne Pastell",
    colors: {
      primary: "#3D405B",
      secondary: "#F5E6CC",
      accent: "#81B29A",
      accentTransparent: "rgba(129, 178, 154, 0.8)",
      white: "#FFFFFF",
      background: "#F9F9F9",
      text: "#333333",
      title: "#E07A5F",
    },
    fonts: {
      body: "Nunito, sans-serif",
      heading: "Bitter, serif",
      accent: "'Playball', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage3,
  },

  version4: {
    name: "Luksuriøs Dyp Lilla",
    colors: {
      primary: "#5D3FD3",
      secondary: "#EDE7F6",
      accent: "#A084E8",
      accentTransparent: "rgba(160, 132, 232, 0.8)",
      white: "#FFFFFF",
      background: "#F9F9F9",
      text: "#2E2E2E",
      title: "#B56576",
    },
    fonts: {
      body: "Open Sans, sans-serif",
      heading: "EB Garamond, serif",
      accent: "'Parisienne', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage4,
  },

  version5: {
    name: "Støvet Lavendel",
    colors: {
      primary: "#725A7A",
      secondary: "#ECE2F0",
      accent: "#B088A3",
      accentTransparent: "rgba(176, 136, 163, 0.8)",
      white: "#FFFFFF",
      background: "#F9F9F9",
      text: "#343434",
      title: "#DA627D",
    },
    fonts: {
      body: "Raleway, sans-serif",
      heading: "Bad Script, cursive",
      accent: "'Pinyon Script', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage5,
  },

  version6: {
    name: "Vintage Blomster",
    colors: {
      primary: "#6C4F77",
      secondary: "#FAE3E3",
      accent: "#D291BC",
      accentTransparent: "rgba(210, 145, 188, 0.8)",
      white: "#FFFFFF",
      background: "#F9F9F9",
      text: "#404040",
      title: "#BC4E9C",
    },
    fonts: {
      body: "Muli, sans-serif",
      heading: "Playfair Display, serif",
      accent: "'Alex Brush', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage6,
  },

  version7: {
    name: "Bonheur Royale",
    colors: {
      primary: "#F2A7B7",
      secondary: "#F8D9E5",
      accent: "#FF6F61",
      accentTransparent: "rgba(255, 111, 97, 0.8)",
      white: "#FFFFFF",
      background: "#F9F9F9",
      text: "#4B4B4B",
      title: "#FF3B2E",
    },
    fonts: {
      body: "Roboto, sans-serif",
      heading: "Quicksand, sans-serif",
      accent: "'Bonheur Royale', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage7,
  },

  version8: {
    name: "Island Moments",
    colors: {
      primary: "#33B5FF",
      secondary: "#A1D8FF",
      accent: "#00B2A9",
      accentTransparent: "rgba(0, 178, 169, 0.8)",
      white: "#FFFFFF",
      background: "#F9F9F9",
      text: "#4A4A4A",
      title: "#028A6E",
    },
    fonts: {
      body: "Lora, serif",
      heading: "Montserrat, sans-serif",
      accent: "'Island Moments', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)",
    },
    heroImage: HeroImage8,
  },
};
