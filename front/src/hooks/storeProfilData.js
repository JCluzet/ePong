import axios from "../config/axios";
// import { accountService } from "./account_service";

let storeProfilData = (token, login) => {
  var config = {
    method: "get",
    url: "/users/profile/" + login,
    headers: { Authorization: "Bearer " + token },
  };
  console.log("storeProfilData");

  // wait until axios is available, then make the request
  axios(config)
    .then(function (response) {
      console.log("OK! STORE PROFIL DATA");

      localStorage.setItem("avatarUrl", response.data.avatarUrl);
      console.log("Avatar saved : " + response.data.avatarUrl);

      localStorage.setItem("isTwoFa", response.data.isTwoFa);
      console.log("isTwoFa saved : " + response.data.isTwoFa);

      localStorage.setItem("username", response.data.name);
      console.log("Username saved : " + response.data.name);
    })
    .catch(function (error) {
      console.log("KO STORE DATAPROFIL!");
      console.log("Erreur, impossible de get /user/profile > ".error);
    });
 // print what is the response status code by making a new request
  console.log("fin storeProfilData");
};

export default storeProfilData;
