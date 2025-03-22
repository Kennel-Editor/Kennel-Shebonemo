import styled from "styled-components";
import { NavDropdown } from "react-bootstrap";

export const HeaderContainer = styled.header`
  position: relative;
  height: 30vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    object-position: 50% 50%;
    @media (max-width: 762px) {
      transform: scale(1.3);
    }
  }
  @media (min-width: 992px) {
    height: 40vh;
  }
`;

export const HeroText = styled.h1`
  position: absolute;
  bottom: 0%;
  font-size: 2.6rem;
  background: ${(props) => props.theme.colors.accentTransparent};
  font-family: ${(props) => props.theme.fonts.accent};
  color: ${(props) => props.theme.colors.white};
  text-shadow: ${(props) => props.theme.shadows.textShadow};
  @media (max-width: 992px) {
    position: relative;
    bottom: 0%;
    font-size: 3rem;
    background: transparent;
    display: flex;
    color: ${(props) => props.theme.colors.white};
    text-shadow: ${(props) => props.theme.shadows.textShadow};
  }
  @media (max-width: 600px) {
    font-size: 2.4rem;
  }
  @media (max-width: 350px) {
    font-size: 2rem;
  }
  a {
    color: ${(props) => props.theme.colors.white};
  }
`;

export const NavContainer = styled.nav`
  position: sticky;
  top: 40px;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease-in-out;

  .navbar {
    display: absolute;
    top: -40px;
  }

  .navbar,
  .dropdown-menu {
    background: ${(props) => props.theme.colors.accent};
    padding: 10px 0px;

    .nav-link.no-active {
      border-bottom: none;
      color: ${(props) => props.theme.colors.text};
    }
    a {
      color: ${(props) => props.theme.colors.text};
      font-family: ${(props) => props.theme.fonts.heading};
      text-decoration: none;
      padding: 1rem;
      transition: all 0.3s ease;
      display: inline-block;
      position: relative;
      &.nytt-kull {
        color: ${(props) => props.theme.colors.primary};
        @media (min-width: 992px) {
          color: ${(props) => props.theme.colors.accent};
        }
      }

      &:hover {
        color: ${(props) => props.theme.colors.accent};
      }

      span {
        position: relative;
      }

      &.active {
        color: black;
        border-bottom: 1px solid ${(props) => props.theme.colors.primary};
        display: inline-block;
        width: max-content;
        @media (min-width: 992px) {
          border-bottom: 1px solid ${(props) => props.theme.colors.accent};
        }
        span::after {
          content: "";
          position: absolute;
          bottom: -32px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: ${(props) => props.theme.colors.white};
        }

        @media (min-width: 992px) {
          span::after {
            background-color: ${(props) => props.theme.colors.accent};
          }
        }
      }
    }

    @media (min-width: 992px) {
      background: ${(props) => props.theme.colors.background};
      top: 0px;
    }
  }

  @media (min-width: 992px) {
    position: static;
    padding: 0;
    width: 100%;
    background: ${(props) => props.theme.colors.background};
    top: 0px;
  }

  .dropdown-menu {
    top: 0px;
    display: none;
    position: relative;
    z-index: 30;
    display: flex;
    flex-direction: column;
    background-color: transparent;
    border: none;
    margin-left: 20px;

    @media (min-width: 992px) {
      background: ${(props) => props.theme.colors.background};
      top: 70%;
      justify-content: center;
    }

    span::after {
      display: none;
    }
    a {
      font-size: 1.2rem;
      transition: background-color 0.3s ease-in-out;
    }

    .navbar .show .dropdown-menu {
      display: block;
      padding-top: 200px;
      background-color: transparent;
    }
  }
`;
