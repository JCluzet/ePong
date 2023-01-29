import React, { useEffect } from "react";
import SettingsImg from "../assets/images/settings_white.png";
import { ReactComponent as Logo } from "../assets/images/logo.svg";
import "../styles/header.css";
import { accountService } from "../hooks/account_service";
import axios from "axios";
import ProfilSettings from "./ProfilSettings";

const Header = () => {
  async function catchUserInfo() {
    var config = {
      method: "get",
      url: "/users/profile/" + accountService.userLogin(),
      headers: { Authorization: "Bearer " + accountService.userToken() },
    };
    await axios(config)
      .then(function (response) {
        if (response.data.name === "")
          localStorage.setItem(
            "Alert",
            "You have been removed from the database"
          );
        setAvatarUrl(response.data.avatarUrl);
        setUsername(response.data.name);
      })
      .catch(function (error) {
        if (error.response.status === 401 || error.response.status === 400) {
          accountService.logout();
        }
      });
    setTimeout(() => {
      catchUserInfo();
    }, 1000);
  }

  const [avatarUrl, setAvatarUrl] = React.useState(null);
  const [detected, setDetected] = React.useState(false);
  const [keyPresses, setKeyPresses] = React.useState([]);
  const [username, setUsername] = React.useState(null);

  useEffect(() => {
    function handleKeyPress(event) {
      setKeyPresses((prevKeyPresses) => [...prevKeyPresses, event.key]);

      if (keyPresses.slice(-4).join("") === "4242") {
        setDetected(true);
      }
    }

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [keyPresses]);

  useEffect(() => {
    catchUserInfo();
  });

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
          {!detected ? (
            <Logo className="logo-header" onClick={HomeClick} />
          ) : (
            <img
              className="logo-header"
              src="https://grademe.fr/PONG.gif"
              onClick={HomeClick}
              alt="logo"
            />
          )}

          <div className="div-profile-header-container-with-settings">
            <div className="div-profile-header">
              <img
                onClick={SettingsOpen}
                className="settings-image"
                src={SettingsImg}
                alt="settings"
              />
              <div className="div-profile-name">
                <div className="text-profile-name">{username}</div>
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
