import imageUrlBuilder from "@sanity/image-url";
import sanityClient from "../sanityClient";

const builder = imageUrlBuilder(sanityClient);

export function urlFor(image, overrideImage, width = 1200) {
  const img = overrideImage || image;
  if (!img) {
    return null;
  }

  return builder.image(img).width(width).fit("max").auto("format").quality(80).url();
}

export function imageProps(image, {width = 1200, sizes = "100vw", lazy = true} = {}) {
  const widths = [...new Set([320, 640, 960, 1200, 1600, 1920, width])]
    .filter((size) => size <= width).sort((a, b) => a - b);
  return {
    src: urlFor(image, undefined, width),
    srcSet: image ? widths.map((size) => `${urlFor(image, undefined, size)} ${size}w`).join(", ") : undefined,
    sizes,
    loading: lazy ? "lazy" : "eager",
    decoding: "async",
  };
}

export function videoUrlFor(video) {
  if (!video) return null;
  return typeof video === "string" ? video : video?.asset?.url || null;
}

