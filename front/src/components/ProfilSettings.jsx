import { accountService } from "../hooks/account_service";
import React from "react";
import returnBack from "../assets/images/return.png";
import "../styles/input-file.css";

export default function ProfilSettings() {
  // state
  const [avatar, setAvatar] = React.useState(true);

  // comportements
  const boolChangeAvatar = () => {
    if (avatar === false) {
      setAvatar(true);
    } else {
      setAvatar(false);
    }
  };

  // affichage

  return (
    // settings display
    <div>
      {avatar && (
        <div className="settings-profil">
          <button className="button" onClick={boolChangeAvatar}>
            <div className="text-logout">CHANGE PROFIL</div>
          </button>
          <button className="button">
            <div className="text-logout">TWO FACTOR AUTH</div>
          </button>
          <button className="button" onClick={accountService.logout}>
            <div className="text-logout">LOGOUT</div>
          </button>
        </div>
      )}

      {/* avatar changement window */}
      {!avatar && (
        // <div className="settings-profil">
        //   <div className="settings-avatar">
            <div className="change-avatar-container">
              <input
                type="text"
                placeholder="New username"
                className="newUsername-text-area"
              />
              {/* File-Input */}
              {/* Upload Avatar Picture */}
              <div className="file-input">
                <input type="file" accept="image/*" />
              </div>
              <div className="button-change-container">
              <button className="button-change">
              <div className="text-change">SAVE</div>
            </button>
            </div>
            <img
              className="return-arrow"
              src={returnBack}
              alt="return"
              onClick={boolChangeAvatar}
              />
              </div>
        //    </div>
        // </div>
        // </div>
      )}
    </div>
  );
}
