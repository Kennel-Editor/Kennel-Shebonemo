import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link, useParams } from "react-router-dom";
import sanityClient from "../sanityClient";
import { StyledBreadcrumb, StyledBreadcrumbItem } from "./Breadcrumbs.styled";

const pathTranslations = {
  dogs: "Våre hunder",
  litters: "Valpekull",
  about: "Om oss",
  contact: "Kontakt",
  gallery: "Galleri",
};

const DynamicBreadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams();

  const pathnames = useMemo(
    () => location.pathname.split("/").filter((x) => x),
    [location.pathname]
  );

  const [data, setData] = useState(null);
  const [galleryTitle, setGalleryTitle] = useState(null); // State to hold the gallery title

  useEffect(() => {
    if (id) {
      const query =
        pathnames[0] === "dogs"
          ? `*[_type == "dog" && _id == $id]{ _id, name, nickname }`
          : pathnames[0] === "litters"
          ? `*[_type == "litter" && _id == $id]{ 
            _id, 
            mother { isOwned, name, nickname, dogReference->{name, nickname} },
            father { isOwned, name, nickname, dogReference->{name, nickname} }
          }`
          : pathnames[0] === "gallery"
          ? `*[_type == "gallery" && _id == $id]{ title }`
          : null;

      if (query) {
        sanityClient
          .fetch(query, { id })
          .then((data) => {
            if (data && data.length > 0) {
              if (pathnames[0] === "gallery") {
                setGalleryTitle(data[0].title);
              } else {
                setData(data[0]);
              }
            } else {
              console.error("No data found for ID:", id);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  }, [id, pathnames]);
  if (location.pathname === "/") return null;
  return (
    <StyledBreadcrumb className="col-10 col-xl-9 m-auto">
      {location.pathname !== "/" && (
        <StyledBreadcrumbItem as={Link} to="/">
          Hjem
        </StyledBreadcrumbItem>
      )}

      {pathnames.map((segment, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        let displayName =
          pathTranslations[segment] ||
          decodeURIComponent(
            segment.charAt(0).toUpperCase() + segment.slice(1)
          );

        if (pathnames[0] === "dogs" && segment === id && data) {
          displayName = data.nickname || data.name;
        }

        if (pathnames[0] === "litters" && segment === id && data) {
          const mother = data.mother || {};
          const father = data.father || {};

          const motherName =
            mother.isOwned && mother.dogReference
              ? mother.dogReference.nickname || mother.dogReference.name
              : mother.nickname || mother.name;

          const fatherName =
            father.isOwned && father.dogReference
              ? father.dogReference.nickname || father.dogReference.name
              : father.nickname || father.name;

          displayName = `${motherName} & ${fatherName}`;
        }

        if (pathnames[0] === "gallery" && segment === id && galleryTitle) {
          displayName = galleryTitle; // Set gallery title if we are on a gallery page
        }

        return (
          <React.Fragment key={to}>
            <span className="separator"> / </span>
            <StyledBreadcrumbItem
              as={Link}
              to={to}
              className={location.pathname === to ? "active pointer" : ""}
            >
              {displayName}
            </StyledBreadcrumbItem>
          </React.Fragment>
        );
      })}
    </StyledBreadcrumb>
  );
};

export default DynamicBreadcrumbs;
