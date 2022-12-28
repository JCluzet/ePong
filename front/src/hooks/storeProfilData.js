import axios from "../config/axios";
import { accountService } from "./account_service";

let storeProfilData = () => {
  var config = {
    method: "get",
    url: "/users/profile/" + accountService.userLogin(),
    headers: { Authorization: "Bearer " + accountService.userToken() },
  };
  console.log("storeProfilData");

  axios(config)
    .then(function (response) {
      console.log("OK!");

      localStorage.setItem("avatarUrl", response.data.avatarUrl);
      console.log("Avatar saved : " + response.data.avatarUrl);

      localStorage.setItem("isTwoFa", response.data.isTwoFa);
      console.log("isTwoFa saved : " + response.data.isTwoFa);

      localStorage.setItem("username", response.data.name);
      console.log("Username saved : " + response.data.name);
    })
    .catch(function (error) {
      console.log("KO!");
      console.log("Erreur, impossible de get /user/profile > ".error);
    });
  console.log("fin storeProfilData");
};

export default storeProfilData;
