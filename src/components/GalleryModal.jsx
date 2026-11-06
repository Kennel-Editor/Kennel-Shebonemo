import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
import { imageProps } from "../utils/sanityImage";
import { galleryVideos } from "../utils/media";
import GalleryImageModal from "../utils/GalleryImageModal";
import {
  GalleryContainer,
  GalleryGrid,
  GalleryImage,
  VideoThumbnail,
} from "../styles/galleryImages.styled";
import { FaPlayCircle } from "react-icons/fa";

const GalleryModal = ({ litterId, dogId }) => {
  const [galleryData, setGalleryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  useEffect(() => {
    if (!litterId && !dogId) return;

    const query = litterId
      ? `*[_type == "litter" && _id == $id]{
          galleries[] {
            title,
            images[] { asset-> { _id, _ref }, crop, hotspot },
            videos[] { _key, asset-> { _id, url, mimeType } },
            video { asset-> { _id, url, mimeType } },
            description
          }
        }`
      : `*[_type == "dog" && _id == $id]{
          gallery
        }`;

    sanityClient
      .fetch(query, { id: litterId || dogId })
      .then((data) => {
        if (litterId) {
          const fetchedData = data[0];
          if (fetchedData?.galleries) {
            const galleryData = fetchedData.galleries.map((gallery, index) => ({
              images: gallery.images || [],
              videos: galleryVideos(gallery),
              text: gallery.description,
              title: gallery.title || `Galleri ${index + 1}`,
            }));
            setGalleryData(galleryData);
          }
        } else if (dogId) {
          const fetchedGallery = data[0]?.gallery || [];
          const galleryData = [
            {
              title: "Galleri",
              images: fetchedGallery.map((image) => ({
                ...image,
                type: "image",
              })),
            },
          ];
          setGalleryData(galleryData);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching gallery data:", error);
        setLoading(false);
      });
  }, [litterId, dogId]);

  if (loading) return <div>Loading galleries...</div>;

  const openGalleryModal = (galleryIndex, mediaIndex) => {
    setCurrentGalleryIndex(galleryIndex);
    setCurrentImageIndex(mediaIndex);
    setIsGalleryModalOpen(true);
  };

  const prevImage = () => {
    const mediaItems = getMediaItems(galleryData[currentGalleryIndex]);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    const mediaItems = getMediaItems(galleryData[currentGalleryIndex]);
    setCurrentImageIndex((prevIndex) =>
      prevIndex === mediaItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const getMediaItems = (gallery) => {
    const mediaItems = gallery.images.map((image) => ({
      type: "image",
      asset: image,
    }));

    for (const video of gallery.videos || []) {
      mediaItems.push({type: "video", url: video.asset.url, mimeType: video.asset.mimeType});
    }

    return mediaItems;
  };

  return (
    <div>
      {galleryData.length > 0
        ? galleryData.map((gallery, galleryIndex) => (
            <GalleryContainer key={galleryIndex} className="mb-4">
              <h4>{gallery.title}</h4>

              <GalleryGrid className="col-12 col-md-10 m-auto">
                {getMediaItems(gallery).map((mediaItem, mediaIndex) => (
                  <div
                    className="col-10 mb-3"
                    key={mediaIndex}
                  >
                    {mediaItem.type === "image" ? (
                      <GalleryImage
                        {...imageProps(mediaItem.asset, {width: 320, sizes: "150px"})}
                        alt={`Gallery Image ${mediaIndex + 1}`}
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          openGalleryModal(galleryIndex, mediaIndex)
                        }
                      />
                    ) : (
                      <div className="row">
                        <VideoThumbnail
                          as="button"
                          type="button"
                          aria-label={`Spill av video ${mediaIndex + 1}`}
                          style={{
                            cursor: "pointer",
                            position: "relative",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          onClick={() =>
                            openGalleryModal(galleryIndex, mediaIndex)
                          }
                        >
                          <FaPlayCircle
                            size={50}
                            color="white"
                            style={{
                              position: "absolute",
                              zIndex: 2,
                              pointerEvents: "none",
                            }}
                          />
                        </VideoThumbnail>
                      </div>
                    )}
                  </div>
                ))}
              </GalleryGrid>
              {gallery.text && <p className="mt-2">{gallery.text}</p>}
            </GalleryContainer>
          ))
        : ""}

      {isGalleryModalOpen && galleryData[currentGalleryIndex] && (
        <GalleryImageModal
          mediaItems={getMediaItems(galleryData[currentGalleryIndex])}
          currentMediaIndex={currentImageIndex}
          onClose={() => setIsGalleryModalOpen(false)}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

export default GalleryModal;
