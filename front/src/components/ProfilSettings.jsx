import { accountService } from "../hooks/account_service";
import React from "react";
import returnBack from "../assets/images/return.png";
import "../styles/input-file.css";

export default function ProfilSettings() {
  // state
  const [avatar, setAvatar] = React.useState(true);
  const [username, setUsername] = React.useState(accountService.userName());
  const [avatarUrl, setAvatarUrl] = React.useState(accountService.userAvatarUrl());

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
        let img = event.target.files[0];
        setAvatarUrl(URL.createObjectURL(img));
        console.log(URL.createObjectURL(img));
    }
    };

  const handleChange = (e) => {
    // if charactere is not more than 20
    if (e.target.value.length <= 20) {
      setUsername(e.target.value);
    }
  };
  // comportements
  const boolChangeAvatar = () => {
    if (avatar === false) {
      setAvatar(true);
    } else {
      setAvatar(false);
    }
  };

  const updateProfil = (e) => {
    e.preventDefault();
    accountService.ModifyUsername(username);
    // accountService.ModifyAvatar(avatarUrl);
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
        <form onSubmit={updateProfil}>
          <div className="change-avatar-container">
            <input
              type="text"
              placeholder="New username"
              value={username}
              onChange={handleChange}
              className="newUsername-text-area"
            />
            <div className="file-input">
              <input type="file" accept="image/*" onChange={onImageChange} />
            </div>
            <div className="button-change-container">
              <button className="button-change" type="submit">
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
        </form>
      )}
    </div>
  );
}
