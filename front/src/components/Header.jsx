import React from "react";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";

const Header = () => {
  // state

  // comportements

  // affichage

  return (
    <nav>
      <div className="container">
        <div className="div-header">
          <Logo className="logo-header" />
        </div>
      </div>
    </nav>
  );
};

export default Header;
