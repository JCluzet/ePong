import React from "react";
// import toastify
// import { toast } from "react-toastify";

import { accountService } from "../hooks/account_service";
import storeProfilData from "../hooks/storeProfilData";

export default function EditProfil({firstlogin}) {
  // state
  const [username, setUsername] = React.useState(accountService.userName());
  const [formData, setFormData] = React.useState(null);

  // comportements

  const updateProfil = async (e) => {
    e.preventDefault();
    if (formData !== null || username !== accountService.userName()) {
      const response = await accountService.editAll(formData, username, accountService.isTwoFa());
      // wait 1000 ms 
        await new Promise((resolve) => setTimeout(resolve, 100));
      storeProfilData(accountService.userToken(), accountService.userLogin(), () => window.location.reload());

    }
    // if (formData !== null) {
    //   await accountService.ModifyAvatar(formData);
    // }
    // if (username !== accountService.userName()) {
    //   await accountService.ModifyUsername(username);
    //   console.log("username changed");
    // }
    // // wait for 3 seconds
    // // await new Promise((resolve) => setTimeout(resolve, 100));
    // if (username !== accountService.userName() || formData !== null) {
    //   await storeProfilData(
    //     accountService.userToken(),
    //     accountService.userLogin(),
    //     () => window.location.reload()
    //   );
    // }
    // // if username is not already taken

    // if (firstlogin) {
    //   if (username !== "")
    //   localStorage.setItem("firstlogin", "false");
    //     window.location.href = "/";
    // }

  };

  const handleChange = (e) => {
    if (e.target.value.length <= 20) {
      setUsername(e.target.value);
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let formdata = new FormData();
      formdata.append("file", event.target.files[0]);
      setFormData(formdata);
    }
  };

  // affichage
  return (
    <div>
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
          {firstlogin === "true" && (
            <div className="firstlogin-text">
                Default avatar is your 42 profil picture 
            </div>
          )}
          <div className="button-change-container">
            <button className="button-change" type="submit">
              <div className="text-change">SAVE</div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
