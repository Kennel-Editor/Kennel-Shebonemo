import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { urlFor } from "../utils/sanityImage";
import Modal from "../utils/ImageModal";
import {
  LitterContainer,
  ParentInfoContainer,
  ParentInfo,
  ParentImage,
  PuppiesContainer,
  MainImgContainer,
} from "./LittersDetail.styled";
import GalleryModal from "../components/GalleryModal";

const LittersDetail = () => {
  const { id } = useParams();
  const [litter, setLitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (!id) {
      console.error("Error: Litter ID is undefined");
      return;
    }

    sanityClient
      .fetch(
        `*[_type == "litter" && _id == $id]{
          _id,
        mother {
  isOwned,
  "dogRef": dogReference->_id,
  name,
  nickname,
  title,
  registrationNumber,
  "image": image { asset-> { _id, _ref }, crop, hotspot },
   "overrideImage": overrideImage { asset-> { _id, _ref }, crop, hotspot },
  info,
  healthResults,
  additionalInfo
},
father {
  isOwned,
  "dogRef": dogReference->_id,
  name,
  nickname,
  title,
  registrationNumber,
  "image": image { asset-> { _id, _ref }, crop, hotspot },
   "overrideImage": overrideImage { asset-> { _id, _ref }, crop, hotspot },
  info,
  healthResults,
  additionalInfo
},

          puppyDetails,
          mainImage { asset-> { _id, _ref }, crop, hotspot },
          additionalImages[]{ asset-> { _id, _ref }, crop, hotspot },
          textUnderImages,
          dateOfBirth,
          galleries,
          expectedDateOfBirth,
          textUnderMainImage,
          freeText1,
          freeText2
        }`,
        { id }
      )
      .then((data) => {
        const litterData = data[0];
        const motherDogRef = litterData.mother.dogRef;
        const fatherDogRef = litterData.father.dogRef;

        return sanityClient
          .fetch(
            `*[_type == "dog" && _id in [$motherDogRef, $fatherDogRef]]{
      _id,
      name,
      nickname,
      title,
      registrationNumber,
      image { asset-> { _id, _ref }, crop, hotspot },
      info,
      healthResults,
      additionalInfo,
      overrideImage, 
    }`,
            { motherDogRef, fatherDogRef }
          )
          .then((dogData) => {
            const motherDog =
              dogData.find((dog) => dog._id === motherDogRef) || {};
            const fatherDog =
              dogData.find((dog) => dog._id === fatherDogRef) || {};
            litterData.mother = {
              ...litterData.mother,
              ...motherDog,
              overrideImage:
                litterData.mother.overrideImage || motherDog.overrideImage,
            };

            litterData.father = {
              ...litterData.father,
              ...fatherDog,
              overrideImage:
                litterData.father.overrideImage || fatherDog.overrideImage,
            };

            setLitter(litterData);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching dog data:", error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>Laster...</div>;
  }

  if (!litter) {
    return <div>Fant ingen kull.</div>;
  }

  const calculateTotalPuppies = () => {
    return (
      litter.puppyDetails?.reduce((total, puppy) => total + puppy.count, 0) || 0
    );
  };

  const totalPuppies = calculateTotalPuppies();

  const getColorPlural = (color, count) => {
    switch (color) {
      case "white":
        return count > 1 ? "hvite" : "hvit";
      case "gray":
        return count > 1 ? "grå" : "grå";
      case "black":
        return count > 1 ? "sorte" : "sort";
      case "brown":
        return count > 1 ? "brune" : "brun";
      case "apricot":
        return count > 1 ? "aprikos" : "aprikos";
      case "red":
        return count > 1 ? "røde" : "rød";
      default:
        return color;
    }
  };

  const getGenderPlural = (gender, count) => {
    return count > 1
      ? gender === "male"
        ? "hanner"
        : "tisper"
      : gender === "male"
      ? "hann"
      : "tispe";
  };

  const openImageModal = (image) => setSelectedImage(image);

  const closeImageModal = () => setSelectedImage(null);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("no-NO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const renderParentInfo = (parent) => {
    const {
      isOwned,
      name,
      nickname,
      image,
      dogReference,
      healthResults,
      additionalInfo,
      overrideImage,
    } = parent;
    const displayName = isOwned && dogReference ? dogReference.name : name;
    const displayNickname =
      isOwned && dogReference ? dogReference.nickname : nickname;
    const displayImage = overrideImage?.asset ? overrideImage : image;

    return (
      <>
        {displayImage && (
          <ParentImage
            className="no-theme"
            src={urlFor(displayImage)}
            alt={displayName}
            onClick={() => openImageModal(urlFor(displayImage))}
          />
        )}
        <div className="mt-2">
          {displayNickname && <h5>{displayNickname}</h5>}
          {parent.registrationNumber && (
            <p>
              <strong>Reg.nr:</strong> {parent.registrationNumber}
            </p>
          )}
          {healthResults && healthResults.length > 0 && (
            <div>
              <ul className="list-unstyled mt-2">
                {healthResults.map((result, index) => (
                  <li key={index}>
                    <strong>{result.title}: </strong>
                    <span>{result.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {additionalInfo && (
            <div className="mt-2">
              <span>{additionalInfo}</span>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <LitterContainer className="col-10 m-auto">
      <h2 className="text-center">Kull Detaljer</h2>
      <ParentInfoContainer className="m-auto d-flex flex-row col-12 col-md-11 col-lg-9 col-xl-8 col-xxl-7 text-center">
        <ParentInfo className="col-6 m-auto">
          <div className="mt-3">
            <h3>
              <strong> Mor</strong>
            </h3>
            <p className="title-text">
              {litter.mother.title && <span>{litter.mother.title}</span>}
            </p>
            <h3 className="litter-name">{litter.mother.name}</h3>
          </div>
          <div className="col-12">{renderParentInfo(litter.mother)}</div>
        </ParentInfo>
        <ParentInfo className="col-6">
          <div className="mt-3">
            <h3>
              <strong> Far</strong>
            </h3>
            <p className="title-text">
              {litter.father.title && <span>{litter.father.title}</span>}
            </p>
            <h3 className="litter-name">{litter.father.name}</h3>
          </div>
          <div className="col-12">{renderParentInfo(litter.father)}</div>
        </ParentInfo>
      </ParentInfoContainer>

      <PuppiesContainer className="col-12 col-lg-10 m-auto">
        <div className="d-flex align-items-baseline col-10 m-auto justify-content-center">
          {litter.dateOfBirth ? (
            <div className="date-container text-center">
              <h3>Født:</h3>
              <h4>{formatDate(litter.dateOfBirth)}</h4>
            </div>
          ) : (
            litter.expectedDateOfBirth && (
              <h4>Valper ventes: {formatDate(litter.expectedDateOfBirth)}</h4>
            )
          )}
        </div>

        {litter.mainImage && (
          <>
            <MainImgContainer className="m-auto col-10 col-lg-8 col-xl-6 d-flex">
              <img
                className="mb-2 rounded"
                src={urlFor(litter.mainImage)}
                alt={`Valpene til ${litter.mother.nickname} og ${litter.father.nickname}`}
                onClick={() => openImageModal(urlFor(litter.mainImage))}
              />
            </MainImgContainer>
            <div className="mb-5 text-center">
              {litter.textUnderMainImage && <p>{litter.textUnderMainImage}</p>}
            </div>
          </>
        )}

        {litter.puppyDetails?.length > 0 && (
          <>
            <h4 className="text-center">Det ble født {totalPuppies} valper!</h4>
            <h5 className="text-center">
              {litter.puppyDetails
                .reduce((acc, puppy) => {
                  const gender = puppy.gender;
                  const color = puppy.color;
                  const existing = acc.find(
                    (item) => item.color === color && item.gender === gender
                  );
                  if (existing) {
                    existing.count += puppy.count;
                  } else {
                    acc.push({ color, gender, count: puppy.count });
                  }
                  return acc;
                }, [])
                .map(
                  (item) =>
                    `${item.count} ${getColorPlural(
                      item.color,
                      item.count
                    )} ${getGenderPlural(item.gender, item.count)}`
                )
                .join(", ")}
            </h5>
          </>
        )}

        {litter.freeText1 && (
          <div className="mb-3 col-10 m-auto">
            <h5 className="text-center">{litter.freeText1}</h5>
          </div>
        )}

        {litter.galleries?.length > 0 && <GalleryModal litterId={id} />}

        <div>
          {litter.freeText2 && (
            <div className="container text-center my-5">
              <p>{litter.freeText2}</p>
            </div>
          )}
        </div>
      </PuppiesContainer>
      {selectedImage && (
        <Modal imageUrl={selectedImage} onClose={closeImageModal} />
      )}
    </LitterContainer>
  );
};

export default LittersDetail;
