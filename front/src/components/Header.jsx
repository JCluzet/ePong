import React, { useEffect } from "react";
import SettingsImg from "../assets/images/settings_white.png";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";
// import axios from "axios";
import { accountService } from "../hooks/account_service";
import ProfilSettings from "./ProfilSettings";

const Header = () => {
  // state

    const [avatarUrl, setAvatarUrl] = React.useState(null);
    const [username, setUsername] = React.useState(null);

    useEffect(() => {
        setAvatarUrl(accountService.userAvatarUrl());
        setUsername(accountService.userName());
    }, []);


  const HomeClick = () => {
    window.location.href = "/";
  };

  const [settings, setSettings] = React.useState(false);

  const SettingsOpen = () => {
    if (settings === false) {
      setSettings(true);
    } else {
      setSettings(false);
    }
  };

  return (
    <nav>
      <div className="container">
        <div className="div-header">
          <Logo className="logo-header" onClick={HomeClick} />
          {/* display image (getProfileImage()) */}
          <div className="div-profile-header-container-with-settings">
            <div className="div-profile-header">
              <img
                onClick={SettingsOpen}
                className="settings-image"
                src={SettingsImg}
                alt="settings"
              />
              <div className="div-profile-name">
                <div className="text-profile-name">
                  {username}
                </div>
              </div>
              <div className="div-profile-picture">
                <img
                  className="profile-image"
                  src={avatarUrl}
                  alt="profilepicture"
                />
              </div>
            </div>
              {settings && <ProfilSettings />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
