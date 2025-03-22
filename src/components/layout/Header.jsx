import React, { useState, useEffect, useRef } from "react";
import { HeaderContainer, HeroText, NavContainer } from "./Header.styled";
import backgroundImage from "../../assets/images/background-dogs-pink.jpeg";
import { Navbar, Nav, Container } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import sanityClient from "../../sanityClient";

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [activeLitter, setActiveLitter] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeDogs, setActiveDogs] = useState(null);
  const [breedingDogs, setBreedingDogs] = useState([]);
  const [deceasedDogs, setDeceasedDogs] = useState([]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [pageTitle, setPageTitle] = useState("Vår Kennel");

  const location = useLocation();
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "litter"]{
          _id,
          dateOfBirth,
          expectedDateOfBirth
        }`
      )
      .then((data) => {
        const today = new Date();
        const newLitters = data.filter((litter) => {
          if (!litter.dateOfBirth) return false;
          const birthDate = new Date(litter.dateOfBirth);
          const diffDays = (today - birthDate) / (1000 * 60 * 60 * 24);
          return diffDays < 70;
        });
        const upcomingLitters = data.filter(
          (litter) => !litter.dateOfBirth && litter.expectedDateOfBirth
        );

        if (newLitters.length > 0) {
          setActiveLitter(newLitters[0]);
        } else if (upcomingLitters.length > 0) {
          setActiveLitter(upcomingLitters[0]);
        }
      })
      .catch(console.error);

    sanityClient
      .fetch(
        `*[_type == "gallery"]{
          _id,
          title,
          "mainImageUrl": mainImage.asset->url
        }`
      )
      .then((data) => {
        if (data.length > 0) {
          setActiveGallery(data);
        }
      })
      .catch(console.error);

    sanityClient
      .fetch(
        `*[_type == "dog"]{
        _id,
        name,
        dogType
      }`
      )
      .then((data) => {
        if (data.length > 0) {
          setActiveDogs(data);

          const breeding = data.filter((dog) => dog.dogType === "breeding");
          const deceased = data.filter((dog) => dog.dogType === "deceased");

          setBreedingDogs(breeding);
          setDeceasedDogs(deceased);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "siteInfo"][0]{
          pageTitle
        }`
      )
      .then((data) => {
        if (data && data.pageTitle) {
          setPageTitle(data.pageTitle);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveLink("hjem");
    else if (path === "/litters") setActiveLink("valpekull");
    else if (path.startsWith("/litters/")) setActiveLink("no-active");
    else if (path === "/about") setActiveLink("om-oss");
    else if (path === "/contact") setActiveLink("kontakt");
    else if (path === "/dogs") setActiveLink("våre-hunder");
    else if (path === "/gallery") setActiveLink("galleri");
    else setActiveLink("");
  }, [location]);

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    setIsNavOpen(false);
    setIsDropdownOpen(false);
  };

  const handleDropdownClick = (sectionId) => {
    setActiveDropdown(sectionId);
    setIsNavOpen(false);
    setIsDropdownOpen(false);
    if (location.pathname !== "/dogs") {
      navigate("/dogs");
      setTimeout(() => scrollToSection(sectionId), 300);
    } else {
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        window.scrollTo({ top: element.offsetTop - 20, behavior: "smooth" });
      }
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        !dropdownRef.current?.contains(event.target)
      ) {
        setIsNavOpen(false);
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <HeaderContainer>
      <img
          src={backgroundImage}
          alt="Hero Image of five poodles sitting in the grass"
          className="hero-image"
        />
        <HeroText className="col-12 m-auto text-center d-none d-lg-block py-2">
          <a href="/"> {pageTitle} </a>
        </HeroText>
      </HeaderContainer>

      <NavContainer ref={navbarRef}>
        <Navbar expand="lg" className="navbar">
          <Container className="d-flex justify-content-between align-items-center col-lg-10">
            <div className="mobile-header d-lg-none d-flex flex-row-reverse align-items-center justify-content-center w-100">
              <HeroText className="m-0 justify-content-center m-auto">
                {pageTitle}
              </HeroText>

              <Navbar.Toggle
                aria-controls="navbar-nav"
                onClick={() => setIsNavOpen(!isNavOpen)}
              />
            </div>
            <Navbar.Collapse id="navbar-nav" in={isNavOpen}>
              <Nav className="w-100 d-lg-flex justify-content-between fs-5 mb-lg-1">
                <NavLink
                  to="/"
                  onClick={() => handleLinkClick("hjem")}
                  className={`nav-link ${
                    activeLink === "hjem" ? "active" : ""
                  }`}
                >
                  Hjem
                </NavLink>

                {activeLitter && (
                  <NavLink
                    to={`/litters/${activeLitter._id}`}
                    onClick={() => handleLinkClick("nytt-kull")}
                    className={`nav-link nytt-kull ${
                      activeLink === "nytt-kull" ? "active" : ""
                    }`}
                  >
                    🐶 Nytt kull!
                  </NavLink>
                )}

                {activeDogs && (
                  <div className="nav-item dropdown" ref={dropdownRef}>
                    <NavLink
                      to="#"
                      className={`nav-link dropdown-toggle ${
                        location.pathname === "/dogs" ? "active" : "no-active"
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsDropdownOpen(!isDropdownOpen);
                      }}
                    >
                      Våre hunder
                    </NavLink>

                    {isDropdownOpen && (
                      <div className="dropdown-menu show">
                        <NavLink
                          to="/dogs#current"
                          onClick={() => handleDropdownClick("current")}
                          className="nav-link no-active"
                        >
                          Alle hundene
                        </NavLink>
                        {breedingDogs.length > 0 && (
                          <NavLink
                            to="/dogs#breeding"
                            onClick={() => handleDropdownClick("breeding")}
                            className="nav-link no-active"
                          >
                            Avlshunder
                          </NavLink>
                        )}
                        {deceasedDogs.length > 0 && (
                          <NavLink
                            to="/dogs#deceased"
                            onClick={() => handleDropdownClick("deceased")}
                            className="nav-link no-active"
                          >
                            Tidligere hunder
                          </NavLink>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <NavLink
                  to="/litters"
                  onClick={() => handleLinkClick("valpekull")}
                  className={`valpekull nav-link ${
                    activeLink === "no-active" ? "no-active" : ""
                  }`}
                >
                  Valpekull
                </NavLink>
                {activeGallery && activeGallery.length > 0 && (
                  <NavLink
                    to="/gallery"
                    onClick={() => handleLinkClick("galleri")}
                    className={`nav-link ${
                      activeLink === "galleri" ? "active" : ""
                    }`}
                  >
                    📸 Galleri
                  </NavLink>
                )}
                <NavLink
                  to="/about"
                  onClick={() => handleLinkClick("om-oss")}
                  className={`nav-link ${
                    activeLink === "om-oss" ? "active" : ""
                  }`}
                >
                  Om oss
                </NavLink>
                <NavLink
                  to="/contact"
                  onClick={() => handleLinkClick("kontakt")}
                  className={`nav-link ${
                    activeLink === "kontakt" ? "active" : ""
                  }`}
                >
                  Kontakt
                </NavLink>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </NavContainer>
    </>
  );
};

export default Header;
