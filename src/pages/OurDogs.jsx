import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import SEO from "../components/SEO";
import LoadingSpinner from "../utils/LoadingSpinner";
import { DogCard, DogsContainer } from "./OurDogs.styled";
import { urlFor } from "../utils/sanityImage";

const OurDogs = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "dog"]{
        _id,
        name,
        nickname,
        dogType,
        dateOfBirth,
        image {
          asset-> {
            _id,
            _ref
          },
          crop,
          hotspot
        }
      }`
      )
      .then((data) => {
        const sortedDogs = data.sort((a, b) => {
          if (a.dateOfBirth && b.dateOfBirth) {
            return new Date(b.dateOfBirth) - new Date(a.dateOfBirth);
          }
          return 0;
        });
        setDogs(sortedDogs);
        setLoading(false);
      })
      .catch(console.error);
    setLoading(false);
  }, []);

  const filterAndSortDogs = (type) =>
    dogs
      .filter((dog) => dog.dogType === type)
      .sort((a, b) => {
        if (a.dateOfBirth && b.dateOfBirth) {
          return new Date(b.dateOfBirth) - new Date(a.dateOfBirth);
        }
        return 0;
      });

  const currentDogs = filterAndSortDogs("current");
  const breedingDogs = filterAndSortDogs("breeding");
  const deceasedDogs = filterAndSortDogs("deceased");

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <SEO
        title="Våre hunder | Kennel Shebonemo"
        description="Bli kjent med hundene hos Kennel Shebonemo – tidligere kjent som Puddel Mona. Her finner du nåværende, tidligere og avlshunder."
        keywords="våre hunder, kennel hunder, Mona Fegri, Puddel Mona, Kennel Shebonemo, storpuddel"
      />

      <DogsContainer className="container col-11 col-lg-10 m-auto">
        <h2 className="mb-3 text-center">Våre Hunder</h2>

        <div id="current" className="row g-4 costum-border pb-4">
          {currentDogs.length > 0 ? (
            currentDogs.map((dog) => (
              <div
                key={dog._id}
                className="col-12 col-sm-10 col-md-6 col-xl-4 mx-auto"
              >
                <DogCard>
                  <Link to={`/dogs/${dog._id}`}>
                    <img src={urlFor(dog.image)} alt={dog.name} />
                    <h3>{dog.nickname}</h3>
                    <h4>{dog.name}</h4>
                  </Link>
                </DogCard>
              </div>
            ))
          ) : (
            <p>Ingen nåværende hunder tilgjengelig.</p>
          )}
        </div>

        {breedingDogs.length > 0 && (
          <div id="breeding" className="row g-4 costum-border">
            <h2 className="mb-3 text-center">Avlshunder</h2>
            {breedingDogs.map((dog) => (
              <div
                key={dog._id}
                className="col-12 col-sm-10 col-md-6 col-xl-4 mx-auto"
              >
                <DogCard>
                  <Link to={`/dogs/${dog._id}`}>
                    <img src={urlFor(dog.image)} alt={dog.name} />
                    <h3>{dog.nickname}</h3>
                    <h4>{dog.name}</h4>
                  </Link>
                </DogCard>
              </div>
            ))}
          </div>
        )}

        {deceasedDogs.length > 0 && (
          <div id="deceased" className="row g-4 costum-border">
            <h2 className="mb-3 text-center">Tidligere Hunder</h2>
            {deceasedDogs.map((dog) => (
              <div
                key={dog._id}
                className="col-12 col-sm-10 col-md-6 col-xl-4 mx-auto"
              >
                <DogCard>
                  <Link to={`/dogs/${dog._id}`}>
                    <img src={urlFor(dog.image)} alt={dog.name} />
                    <h3>{dog.nickname}</h3>
                    <h4>{dog.name}</h4>
                  </Link>
                </DogCard>
              </div>
            ))}
          </div>
        )}
      </DogsContainer>
    </>
  );
};

export default OurDogs;
