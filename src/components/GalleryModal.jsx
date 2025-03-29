import React, { useState, useEffect } from "react";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import GalleryImageModal from "../utils/GalleryImageModal";
import { GalleryContainer, GalleryGrid, GalleryImage, VideoThumbnail } from "../styles/galleryImages.styled";
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
            video { asset-> { _id, url } },
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
              video: gallery.video?.asset?.url || null,
              text: gallery.description,
              title: gallery.title || `Galleri ${index + 1}`,
            }));
            setGalleryData(galleryData);
          }
        } else if (dogId) {
          const fetchedGallery = data[0]?.gallery || [];
          const galleryData = [{
            title: "Galleri",
            images: fetchedGallery.map(image => ({
              asset: image.asset,
              type: "image",
            }))
          }];
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
      asset: image.asset,
    }));

    if (gallery.video) {
      mediaItems.push({
        type: "video",
        url: gallery.video,
      });
    }

    return mediaItems;
  };

  return (
    <div>
      {galleryData.length > 0 ? (
        galleryData.map((gallery, galleryIndex) => (
          <GalleryContainer key={galleryIndex} className="mb-4">
            <h4>{gallery.title}</h4>
            <GalleryGrid>
              
              {getMediaItems(gallery).map((mediaItem, mediaIndex) => (
                <div className="" key={mediaIndex}>
                  {mediaItem.type === "image" ? (
                    <GalleryImage
                      src={urlFor(mediaItem.asset)}
                      alt={`Gallery Image ${mediaIndex + 1}`}
                      onClick={() => openGalleryModal(galleryIndex, mediaIndex)}
                    />
                  ) : (
                    <VideoThumbnail onClick={() => openGalleryModal(galleryIndex, mediaIndex)}>
                      <FaPlayCircle size={50} />
                    </VideoThumbnail>
                  )}
                </div>
              ))}
           </GalleryGrid>
          </GalleryContainer>
        ))
      ) : (
        <div>No gallery available.</div>
      )}

      {isGalleryModalOpen && (
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
