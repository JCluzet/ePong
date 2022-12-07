import React from "react";
import SettingsImg from "../assets/images/settings_white.png";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";
// import axios from "axios";
import { accountService } from "../hooks/account_service";
import ProfilSettings from "./ProfilSettings";

const Header = () => {
  // state
  const HomeClick = () => {
    window.location.href = "/";
  };

  const [settings, setSettings] = React.useState(false);

  const SettingsOpen = () => {
    if (settings === false) {
      setSettings(true);
    }
    else {
        setSettings(false);
    }
  };
  // if user has the mouse over the avatar, display another image ./assets/images/settings.png
  // else display the avatar

  // const avatarurl = accountService.userAvatarUrl();

  // if (accountService.userAvatarUrl() === "./assets/images/avatar.png") {
  //   accountService.userAvatarUrl("./assets/images/settings.png");
  // }
  //   };

  // comportements

  // affichage

  return (
    <nav>
      <div className="container">
        <div className="div-header">
          <Logo className="logo-header" onClick={HomeClick} />
          {/* display image (getProfileImage()) */}
          <div className="div-profile-header-container-with-settings">
            <div className="div-profile-header" onClick={SettingsOpen}>
              <img
                onClick={SettingsOpen}
                className="settings-image"
                src={SettingsImg}
                alt="settings"
              />
              <div className="div-profile-name">
                <div className="text-profile-name">
                  {accountService.userLogin()}
                </div>
              </div>
              <div className="div-profile-picture">
                <img
                  onClick={SettingsOpen}
                  className="profile-image"
                  src={accountService.userAvatarUrl()}
                  alt="profilepicture"
                />
              </div>
            </div>
            {settings && <ProfilSettings />}
          </div>
          {/* <button className="button" onClick={accountService.logout}>
            <div className="text-logout">LOGOUT</div>
          </button> */}
        </div>
      </div>
    </nav>
  );
};

export default Header;
