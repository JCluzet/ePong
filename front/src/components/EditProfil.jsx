import React from "react";
import axios from "../config/axios";
// import toastify
import { toast } from 'react-toastify';
// import { toast } from ""

import { accountService } from "../hooks/account_service";
import storeProfilData from "../hooks/storeProfilData";


// create a function that return false if username is already taken and true if not
const checkUsername = async (username) => {
    // do a get at /users/checkName with username as param
    // if response is 200 return true
    // else return false
    // return false;
    var config = {
        method: "get",
        url: "/users/checkName?=" + username,
        headers: {
            'Authorization': 'Bearer ' + accountService.userToken(),
        }
    }
    axios(config)
        .then((response) => {
            console.log("checkName responseGood: " + response.data);
            return true;
        })
        .catch((error) => {
            console.log("Erreur de checkNameFalse!" + error);
            return false;
        });
};
    // return true;


export default function EditProfil({firstlogin}) {
  // state
  const [username, setUsername] = React.useState(accountService.userName());
  const [formData, setFormData] = React.useState(undefined);
  // comportements





  const updateProfil = async (e) => {
    e.preventDefault();

    // if 
    if (formData !== undefined || username !== accountService.userName()) {
        const nameAvailable = await checkUsername(username);
        if (username === "") {
            // toastify
            toast.error("Username can't be empty");
            return;
        }
        if (nameAvailable === false) {
            // toastify
            toast.error("Username already taken");
            return;
        }
        await accountService.editAll(formData, username, accountService.isTwoFa());
        // wait 1000 ms 
        await new Promise((resolve) => setTimeout(resolve, 500));
        const response = await storeProfilData(accountService.userToken(), accountService.userLogin(), () => window.location.reload());

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

    if (firstlogin === "true") {
      if (username !== "")
      localStorage.setItem("firstlogin", "false");
        window.location.href = "/";
    }

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
        {/* <ToastContainer /> */}
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
