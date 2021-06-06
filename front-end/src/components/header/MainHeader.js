import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as BurgerMenu } from "../../global/assets/header-nav.svg";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../global/context/auth/AuthContext";

let closeOnBlurWait;
function MainHeader(props) {
  const { isValidated, signIn, signOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announceMenuToggle, setAnnounceMenuToggle] = useState(false);

  const headerRef = useRef();

  useEffect(() => {
    props.setHeaderHeight(headerRef?.current?.offsetHeight ?? 60)
  }, [isMenuOpen])

  useEffect(() => {
    return () => clearTimeout(closeOnBlurWait);
  }, []);

  function openMenu() {
    setIsMenuOpen(true);
    setAnnounceMenuToggle(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
    setAnnounceMenuToggle(true);
  }

  const siteLogo = (
    <picture>
      <source
        srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp"
        media="(max-width: 850px)"
      />
      <source
        srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
        media="(max-width: 850px)"
      />
      <source srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp" />
      <img
        src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
        alt="site logo link to profiles page"
      />
    </picture>
  );

  const siteNav = (
    <ul aria-label="site navigation menu" className="menu-group">
      <li>
        <Link to="/" className="nav-item">
          Profiles
        </Link>
      </li>
      <li>
        <Link to="/profile-dashboard" className="nav-item">
          Dashboard
        </Link>
      </li>
      <li>
        <button className="nav-item" type="button" onClick={signOut}>
          Sign Out
        </button>
      </li>
    </ul>
  );

  let menuButton;
  if (isMenuOpen) {
    menuButton = (
      <button
        type="button"
        className="button menu-button"
        aria-label="close menu"
        aria-expanded="true"
        onClick={closeMenu}
      >
        <BurgerMenu className="icon rotate" aria-hidden="true" />
      </button>
    );
  } else {
    menuButton = (
      <button
        type="button"
        className="button menu-button"
        aria-label="open menu"
        aria-expanded="false"
        onClick={openMenu}
      >
        <BurgerMenu className="icon" aria-hidden="true" />
      </button>
    );
  }

  return (
    <Header ref={headerRef}>
      <div className="sr-only" aria-live="polite" aria-relevant="additions">
        {announceMenuToggle && isMenuOpen ? "Opened SubMenu" : null}
        {announceMenuToggle && !isMenuOpen ? "Closed SubMenu" : null}
      </div>

      <Nav aria-label="site">
        {isValidated ? (
          <>
            <div className="fixed-container">
              <div className="logo-container">
                <Link to="/" className="site-logo">
                  {siteLogo}
                </Link>
              </div>
              <div className="button-container mobile">{menuButton}</div>
              <div className="menu-container desktop">
              {siteNav}
              </div>
            </div>
            <div className={`menu-container mobile ${isMenuOpen ? "" : "hidden"}`}>
              {siteNav}
            </div>
          </>
        ) : (
          <div className="fixed-container">
            <div className="logo-container">
              <Link to="/" className="site-logo">
                {siteLogo}
              </Link>
            </div>
            <div className="button-container">
              <button
                type="button"
                className="button signin-button"
                onClick={signIn}
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </Nav>
    </Header>
  );
}

const Header = styled.header`
  border-bottom: solid 1px rgba(229, 231, 235, 0.5);
  background-color: white;

  @media (min-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    border-bottom: solid 1px rgba(229, 231, 235, 0.8);
  }
`;

const Nav = styled.nav`
  .fixed-container {
    height: 55px;
    padding: 5px;
    display: flex;

    @media (min-width: 450px) {
      justify-content: space-between;
      align-items: center;
    }

    .logo-container {
      flex-basis: 75%;

      @media (min-width: 450px) {
        flex-basis: 40%;
      }

      .site-logo {
        picture {
          display: inline-block;
        }

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .button-container {
      flex-basis: 25%;
      display: flex;
      justify-content: flex-end;

      .button {
        border: none;
        background-color: white;
      }

      .menu-button {
        height: 100%;
        width: 100%;
        max-width: 60px;
        overflow: hidden;

        .icon {
          transition: all 0.3s linear;
          height: 100%;
        }

        .icon.rotate {
          transform: rotate(90deg);
        }
      }
    }

    .button-container.mobile {
      @media (min-width: 450px) {
        display: none;
      }
    }
  }

  .menu-container {
    border-top: solid 1px rgba(229, 231, 235, 0.5);
    padding: 5px;

    .menu-group {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }
  }

  .menu-container.hidden {
    display: none;
  }

  .menu-container.desktop {
    display: none;

    @media (min-width: 450px) {
      display: block;
      flex-basis: 60%;
      border: none;
    }
  }

  .menu-container.mobile {
    @media (min-width: 450px) {
      display: none;
    }
  }
`;

export default MainHeader;
