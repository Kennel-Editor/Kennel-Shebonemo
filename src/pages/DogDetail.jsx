import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import Modal from "../utils/ImageModal";
import GalleryImageModal from "../utils/GalleryImageModal";
import { urlFor } from "../utils/sanityImage";
import {
  DetailContainer,
  DogImage,
  DogName,
  DogInfo,
  HealthResults,
  HealthResultItem,
  InfoWrapper,
  PedigreeImage,
} from "./DogDetail.styled";
import { GalleryContainer, GalleryImage } from "../styles/galleryImages.styled";

const DogDetail = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [litters, setLitters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  const [totalPuppies, setTotalPuppies] = useState(0);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "dog" && _id == $id]{
          _id,
          name,
          nickname,
          dogType,
          title,
          breed,
          color,
          gender,
          dateOfBirth,
          dateOfDeath,
          registrationNumber,
          healthResults,
          breedingNotes,
          breedingDogsInfo,
          image {
            asset-> {
              _id,
              _ref
            },
            crop,
            hotspot
          },
          "pedigreeUrl": pedigree.asset->url,
          "gallery": gallery[] {
            asset-> {
              _id,
              _ref
            },
            crop,
            hotspot
          },
          description,
          "mother": mother->{
            _id,
            name,
            nickname
          },
          "father": father->{
            _id,
            name,
            nickname
          }
        }`,
        { id }
      )
      .then((data) => {
        setDog(data[0]);
        setLoading(false);

        const dogId = data[0]?._id;

        const fetchLitters = async () => {
          const littersData = await sanityClient.fetch(
            `*[_type == "litter" && (
              mother.dogReference._ref == $dogId || 
              father.dogReference._ref == $dogId
            )] {
              _id,
              mother->{
                name,
                nickname
              },
              father->{
                name,
                nickname
              },
              dateOfBirth,
              puppyDetails
            }`,
            { dogId }
          );
          const totalPuppies = littersData.reduce((acc, litter) => {
            const puppiesInLitter = litter.puppyDetails?.reduce(
              (sum, puppy) => sum + (puppy.count || 0),
              0
            );
            return acc + puppiesInLitter;
          }, 0);

          setLitters(littersData);
          setTotalPuppies(totalPuppies);
        };

        fetchLitters();
      })
      .catch(console.error);
  }, [id]);
  if (loading) return <div>Laster...</div>;
  if (!dog) return <div>Fant ingen hund.</div>;

  const openGalleryModal = (index) => {
    setCurrentGalleryIndex(index);
    setIsGalleryModalOpen(true);
  };

  const prevImage = () => {
    setCurrentGalleryIndex((prevIndex) =>
      prevIndex === 0 ? dog.gallery.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentGalleryIndex((prevIndex) =>
      prevIndex === dog.gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  const renderInfoAsBulletPoints = (info) => {
    return (
      <ul>
        {info.split("\n").map((item, index) => (
          <li className="list-unstyled text-start" key={index}>
            {item}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <DetailContainer className="col-10 col-xl-8">
      <div className="mb-5 mt-2 text-center">
        <DogName className="text-center">{dog.title}</DogName>
        <DogName className="text-center">{dog.name}</DogName>
        <h4>"{dog.nickname}"</h4>
      </div>
      <div className="row align-items-start mb-4">
        <div className="col-12 col-sm-8 col-md-5 col-lg-5 col-xl-4 d-flex justify-content-center flex-column m-auto">
          <DogImage
            src={urlFor(dog.image)}
            alt={dog.name}
            onClick={() => {
              setCurrentImage(urlFor(dog.image));
              setIsModalOpen(true);
            }}
          />
        </div>

        <div className=" col-10 col-md-6 mx-auto justify-content-center">
          <div className="row">
            <div className="col-12 col-sm-7 col-lg-5 mx-auto">
              <InfoWrapper className="m-auto mt-4">
                {dog.registrationNumber && (
                  <DogInfo>
                    <strong>Reg Nr:</strong> {dog.registrationNumber}
                  </DogInfo>
                )}
                {dog.breed && (
                  <DogInfo>
                    <strong>Rase:</strong> {dog.breed}
                  </DogInfo>
                )}
                {dog.color && (
                  <DogInfo>
                    <strong>Farge:</strong> {dog.color}
                  </DogInfo>
                )}
                {dog.gender && (
                  <DogInfo>
                    <strong>Kjønn:</strong>{" "}
                    {dog.gender === "male"
                      ? "Hann"
                      : dog.gender === "female"
                      ? "Tispe"
                      : dog.gender}
                  </DogInfo>
                )}

                <div className="d-flex">
                  {dog.dogType === "deceased" ? (
                    <>
                      {dog.dateOfBirth && (
                        <DogInfo className="d-flex flex-column">
                          <strong>Fødselsdato:</strong>{" "}
                          {new Date(dog.dateOfBirth).toLocaleDateString(
                            "no-NO",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                          -{" "}
                          {new Date(dog.dateOfDeath).toLocaleDateString(
                            "no-NO",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </DogInfo>
                      )}
                    </>
                  ) : (
                    dog.dateOfBirth && (
                      <DogInfo>
                        <strong>Fødselsdato:</strong>{" "}
                        {new Date(dog.dateOfBirth).toLocaleDateString("no-NO", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </DogInfo>
                    )
                  )}
                </div>

                {(litters.length > 0 || dog.breedingNotes) && (
                  <div className="mt-4">
                    <strong>Valpekull:</strong>
                    {litters.length > 0 && (
                      <div className="litters-list ms-1">
                        {litters.map((litter, index) => {
                          const dateOfBirth = litter.dateOfBirth
                            ? new Date(litter.dateOfBirth).toLocaleDateString(
                                "no-NO",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "Ukjent dato";

                          const totalPuppies = litter.puppyDetails
                            ? litter.puppyDetails.reduce(
                                (sum, puppy) => sum + (puppy.count || 0),
                                0
                              )
                            : 0;

                          return (
                            <div key={litter._id} className="litter-item mb-2">
                              <Link
                                to={`/litters/${litter._id}`}
                                style={{
                                  textDecoration: "underline",
                                  cursor: "pointer",
                                }}
                              >
                                <div className="d-flex justify-content-start align-items-center">
                                  <div>
                                    {dateOfBirth} - {totalPuppies} valper
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {dog.breedingNotes && (
                      <div className="breeding-notes">
                        <p>{dog.breedingNotes}</p>
                      </div>
                    )}
                  </div>
                )}
              </InfoWrapper>
            </div>
            {/* Health Results */}
            <div className="col-12 col-sm-5 col-lg-6 mx-auto">
              {dog.healthResults?.length > 0 && (
                <InfoWrapper className="m-auto mt-2 mt-sm-4">
                  <HealthResults>
                    <ul>
                      {dog.healthResults.map((result, index) => (
                        <HealthResultItem key={index}>
                          <strong>{result.title}:</strong> {result.description}
                        </HealthResultItem>
                      ))}
                    </ul>
                  </HealthResults>
                </InfoWrapper>
              )}
            </div>
          </div>
        </div>
      </div>

      {dog.description && (
        <DogInfo>
          <strong>Beskrivelse:</strong> {dog.description}
        </DogInfo>
      )}

      {dog.breedingDogsInfo && (
        <DogInfo className="d-flex flex-column border col-10 col-md-8 m-auto p-4">
          {dog.breedingDogsInfo}
        </DogInfo>
      )}

      {/* Gallery Section */}
      {dog.gallery && dog.gallery.length > 0 && (
        <GalleryContainer className="mt-4">
          <h4>Galleri</h4>
          <div className="row">
            {dog.gallery.map((image, index) =>
              image.asset ? (
                <GalleryImage
                  key={index}
                  src={urlFor(image)}
                  alt={`Galleri bilde ${index + 1}`}
                  onClick={() => openGalleryModal(index)}
                />
              ) : null
            )}
          </div>
        </GalleryContainer>
      )}

      {/* Pedigree Section */}
      {dog.pedigreeUrl && (
        <div className="mt-5 text-center col-12 col-sm-8 m-auto">
          <h4>Stamtavle</h4>
          <PedigreeImage
            src={dog.pedigreeUrl}
            alt="Stamtavle"
            onClick={() => {
              setCurrentImage(dog.pedigreeUrl);
              setIsModalOpen(true);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <Modal imageUrl={currentImage} onClose={() => setIsModalOpen(false)} />
      )}

      {isGalleryModalOpen && (
        <GalleryImageModal
          images={dog.gallery.map((image) => urlFor(image))}
          currentImageIndex={currentGalleryIndex}
          onClose={() => setIsGalleryModalOpen(false)}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </DetailContainer>
  );
};

export default DogDetail;
