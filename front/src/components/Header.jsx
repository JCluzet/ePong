import React from "react";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";

const Header = () => {
  // state
    const HomeClick = () => {
        window.location.href = "/dashboard";
    };

  // comportements

  // affichage

  return (
    <nav>
      <div className="container">
        <div className="div-header">
            {/* <img src={Logo} alt="logo" className="logo" /> */}
          <Logo className="logo-header" onClick={HomeClick}/>
        </div>
      </div>
    </nav>
  );
};

export default Header;
