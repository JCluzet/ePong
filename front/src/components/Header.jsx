import React from "react";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";
// import axios from "axios";
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
          {/* display image (getProfileImage()) */}
            <div className="div-profile-picture">
                <img className="profile-image" src={accountService.userAvatarUrl()} alt="profilepicture" />
            </div>
          <button className="button" onClick={accountService.logout}> 
            <div className="text-logout">LOGOUT</div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;
