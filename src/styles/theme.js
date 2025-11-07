import { hexToRgba } from "../utils/hexToRgba";

const extractHex = (val, fallback) => {
  if (!val) return fallback;
  if (typeof val === "string") return val;
  if (typeof val.hex === "string") return val.hex;
  if (val.hex?.value) return val.hex.value;
  return fallback;
};

export const getTheme = (settings) => {
  settings = settings || {};
  const accent = extractHex(settings.accentColor, "#cc9fbd");

  return {
    colors: {
      primary: extractHex(settings.primaryColor, "#725A7A"),
      secondary: extractHex(settings.secondaryColor, "#9F7D94"),
      accent,
      accentTransparent: hexToRgba(accent, 0.8),
      white: "#FFFFFF",
      background: extractHex(settings.backgroundColor, "#F9F9F9"),
      text: extractHex(settings.textColor, "#343434"),
      title: extractHex(settings.titleColor, "#DA627D"),
    },
    fonts: {
      body: settings.bodyFont || "Raleway, sans-serif",
      heading: settings.headingFont || "Quicksand, sans-serif",
      accent: settings.accentFont || "'Great Vibes', cursive",
    },
    shadows: {
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      textShadow: "0px 0px 1px rgba(0, 0, 0, 0.8)",
    },
  };
};
