import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import SEO from "../components/SEO";
import { LitterCard, LitterContainer } from "./Litters.styled";
import { urlFor } from "../utils/sanityImage";
import LoadingSpinner from "../utils/LoadingSpinner";

// Helper function to get name
const getDogName = (dog) => {
  if (!dog) return "Ukjent";
  return dog.dogReference
    ? dog.dogReference.nickname || dog.dogReference.name || "Ukjent"
    : dog.nickname || dog.name || "Ukjent";
};

const getDogImage = (dog) => {
  if (!dog) return null;
  return dog.overrideImage?.asset
    ? urlFor(dog.overrideImage)
    : dog.dogReference?.image?.asset
    ? urlFor(dog.dogReference.image)
    : dog.image?.asset
    ? urlFor(dog.image)
    : null;
};

const LitterCardItem = ({ litter }) => {
  const motherName = getDogName(litter.mother);
  const fatherName = getDogName(litter.father);
  const motherImage = getDogImage(litter.mother);
  const fatherImage = getDogImage(litter.father);

  return (
    <>
      <SEO
        title="Valpekull hos Kennel Shebonemo"
        description="Se oversikt over tidligere, nåværende og kommende valpekull hos Kennel Shebonemo. Oppdrett av storpudler ved Mona Fegri."
        keywords="valpekull, puddel valper, Kennel Shebonemo, Puddel Mona, Mona Fegri, storpuddel oppdrett"
      />

      <div
        key={litter._id}
        className="col-12 col-sm-10 col-md-6 col-lg-4 mx-auto mb-4"
      >
        <LitterCard>
          <Link to={`/litters/${litter._id}`}>
            <h3>
              {motherName} & {fatherName}
            </h3>
            <div className="d-flex justify-content-center mb-2">
              {motherImage && (
                <img
                  src={motherImage}
                  alt={litter.mother.nickname || litter.mother.name}
                  className="img-fluid no-theme"
                  style={{ marginRight: "1%" }}
                />
              )}
              {fatherImage && (
                <img
                  src={fatherImage}
                  alt={litter.father.nickname || litter.father.name}
                  className="img-fluid no-theme"
                />
              )}
            </div>
            {litter.expectedPuppies && (
              <p>Forventede valper: {litter.expectedPuppies}</p>
            )}
            {/* Display expected birth date only if no birth date is present */}
            {!litter.dateOfBirth && litter.expectedDateOfBirth && (
              <p>
                Forventes:{" "}
                {new Date(litter.expectedDateOfBirth).toLocaleDateString(
                  "no-NO",
                  {
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            )}
            {/* Display actual birth date only if it exists */}
            {litter.dateOfBirth && (
              <p>
                Dato født:{" "}
                {new Date(litter.dateOfBirth).toLocaleDateString("no-NO", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </p>
            )}
            {litter.puppyCount && <p>Antall valper: {litter.puppyCount}</p>}
          </Link>
        </LitterCard>
      </div>
    </>
  );
};

// LitterCardList component to reuse the rendering logic for multiple litters
const LitterCardList = ({ litters, title }) => (
  <div className="row g-4 costum-border pb-4">
    <h2 className="text-center">{title}</h2>
    {litters.map((litter) => (
      <LitterCardItem key={litter._id} litter={litter} />
    ))}
  </div>
);

const Litters = () => {
  const [litters, setLitters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "litter"]{
          _id,
          mother {
            name,
            nickname,
            image { asset-> { _id, _ref }, crop, hotspot },
            overrideImage { asset-> { _id, _ref }, crop, hotspot },
            dogReference->{name, nickname, image, isOwned}
          },
          father {
            name,
            nickname,
            image { asset-> { _id, _ref }, crop, hotspot },
            overrideImage { asset-> { _id, _ref }, crop, hotspot },
            dogReference->{name, nickname, image, isOwned}
          },
          expectedPuppies,
          puppyCount,
          dateOfBirth,
          expectedDateOfBirth
        }`
      )
      .then((data) => {
        const sortedLitters = data.sort((a, b) => {
          if (!a.dateOfBirth) return 1;
          if (!b.dateOfBirth) return -1;
          return new Date(b.dateOfBirth) - new Date(a.dateOfBirth);
        });
        setLitters(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  // Function to check if the litter is less than 10 weeks old
  const isNewLitter = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const diffTime = today - birthDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays < 70; // 70 days = 10 weeks
  };

  const upcomingLitters = litters.filter((litter) => !litter.dateOfBirth);
  const newLitters = litters.filter(
    (litter) => litter.dateOfBirth && isNewLitter(litter.dateOfBirth)
  );
  const pastLitters = litters.filter(
    (litter) => litter.dateOfBirth && !isNewLitter(litter.dateOfBirth)
  );

  return (
    <LitterContainer className="col-10 col-md-10">
      {upcomingLitters.length > 0 && (
        <LitterCardList litters={upcomingLitters} title="Kommende Valper" />
      )}
      {newLitters.length > 0 && (
        <LitterCardList litters={newLitters} title="Valpekull" />
      )}
      {pastLitters.length > 0 && (
        <LitterCardList litters={pastLitters} title="Tidligere valpekull" />
      )}
    </LitterContainer>
  );
};

export default Litters;
