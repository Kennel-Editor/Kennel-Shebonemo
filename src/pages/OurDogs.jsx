import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sanityClient from "../sanityClient";
import { DogCard, DogsContainer } from "./OurDogs.styled";
import { urlFor } from "../utils/sanityImage";

const OurDogs = () => {
  const [dogs, setDogs] = useState([]);

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
        const sortedDogs = data
          .filter((dog) => dog.dateOfBirth)
          .sort((a, b) => new Date(b.dateOfBirth) - new Date(a.dateOfBirth));
        setDogs(sortedDogs);
      })
      .catch(console.error);
  }, []);

  const filterAndSortDogs = (type) =>
    dogs
      .filter((dog) => dog.dogType === type && dog.dateOfBirth)
      .sort((a, b) => new Date(b.dateOfBirth) - new Date(a.dateOfBirth));

  const currentDogs = filterAndSortDogs("current");
  const breedingDogs = filterAndSortDogs("breeding");
  const deceasedDogs = filterAndSortDogs("deceased");

  return (
    <DogsContainer className="container col-lg-10">
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

      <div id="breeding" className="row g-4 costum-border">
        <h2 className="mb-3 text-center">Avlshunder</h2>
        {breedingDogs.length > 0 ? (
          breedingDogs.map((dog) => (
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
          <p>Ingen avlshunder tilgjengelig.</p>
        )}
      </div>

      <div id="deceased" className="row g-4 costum-border">
        <h2 className="mb-3 text-center">Tidligere Hunder</h2>
        {deceasedDogs.length > 0 ? (
          deceasedDogs.map((dog) => (
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
          <p>Ingen tidligere hunder tilgjengelig.</p>
        )}
      </div>
    </DogsContainer>
  );
};

export default OurDogs;
