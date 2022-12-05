import React from "react";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";
import { accountService } from "../hooks/account_service";

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
          <Logo className="logo-header" onClick={HomeClick}/>
          <button onClick={accountService.logout}> Logout </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
