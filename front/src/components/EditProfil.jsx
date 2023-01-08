import React from "react";
import axios from "../config/axios";
import { toast } from "react-toastify";
import { accountService } from "../hooks/account_service";
import storeProfilData from "../hooks/storeProfilData";

const checkUsername = async (username) => {
  let isAvailable = 0;
  var config = {
    method: "get",
    url: "/users/checkName?name=" + username,
    headers: {
      Authorization: "Bearer " + accountService.userToken(),
    },
  };
  await axios(config)
    .then((response) => {
      console.log("checkName responseGood: " + response.data);
      isAvailable = 1;
    })
    .catch((error) => {
      console.log("Username deja pris" + error);
      isAvailable = 0;
    });
  return isAvailable;
};

export default function EditProfil({ firstlogin }) {
  const [username, setUsername] = React.useState(accountService.userName());
  const [formData, setFormData] = React.useState(undefined);

  const updateProfil = async (e) => {
    e.preventDefault();

    if (formData !== undefined || username !== accountService.userName()) {
      if (username === "") {
        toast.error("Username can't be empty");
        return;
      }
      if ((await checkUsername(username)) === 0) {
        toast.error(username + " is already taken");
        return;
      }
      await accountService.editAll(
        formData,
        username,
        accountService.isTwoFa()
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await storeProfilData(
        accountService.userToken(),
        accountService.userLogin(),
        () => window.location.reload()
      );
    } else {
      toast.info("Nothing to change");
    }

    if (firstlogin === "true") {
      if (username !== "") localStorage.setItem("firstlogin", "false");
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
